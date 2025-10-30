import { router } from 'expo-router';
import { Check, ChevronDown, Clock, Plus, Save, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Spinner, Text, XStack, YStack } from 'tamagui';
import { ExerciseSelectorModal } from '../../components/ExerciseSelectorModal';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkout } from '../../contexts/WorkoutContext';
import { exerciseService } from '../../services/exercise.service';
import {
  ExerciseSet,
  SessionExercise,
  WorkoutSessionWithDetails,
  workoutSessionService
} from '../../services/workoutsession.service';
import { Exercise } from '../../types/database.types';
interface LocalExercise extends SessionExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
}

export default function ActiveWorkoutModal() {
  const { user } = useAuth();
  const { sessionId, endWorkout } = useWorkout();
  const [session, setSession] = useState<WorkoutSessionWithDetails | null>(null);
  const [exercises, setExercises] = useState<LocalExercise[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [notes, setNotes] = useState('');

  // Timer
  useEffect(() => {
    if (!session) return;
    
    const startTime = new Date(session.start_time).getTime();
    const updateTimer = () => {
      const now = Date.now();
      setElapsedTime(Math.floor((now - startTime) / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [session]);

  // Load session and exercises
  useEffect(() => {
    if (sessionId) {
      loadSession();
      loadAvailableExercises();
    }
  }, [sessionId]);

  const loadSession = async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      const data = await workoutSessionService.getSessionDetails(sessionId);
      if (data) {
        setSession(data);
        setExercises(data.exercises as LocalExercise[]);
        setNotes(data.notes || '');
      }
    } catch (error) {
      console.error('Error loading session:', error);
      Alert.alert('Error', 'Failed to load workout session');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableExercises = async () => {
    try {
      const data = await exerciseService.getAllExercises();
      setAvailableExercises(data);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const renderRightActions = (onDelete: () => void) => (
    <YStack
      jc="center"
      ai="center"
      w={72}
      h="100%"
      backgroundColor="#ef4444"
      borderTopRightRadius={8}
      borderBottomRightRadius={8}
    >
      <TouchableOpacity onPress={onDelete} accessibilityLabel="Delete set">
        <Trash2 size={22} color="white" />
      </TouchableOpacity>
    </YStack>
  );


  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddExercise = async (selectedExercise: Exercise) => {
    if (!sessionId) return;

    try {
      setSaving(true);
      const order = exercises.length;

      // Add exercise to session
      const sessionExercise = await workoutSessionService.addExerciseToSession(
        sessionId,
        selectedExercise.id,
        order
      );

      // Automatically add an empty set
      const firstSet = await workoutSessionService.addSetToExercise(
        sessionExercise.id,
        {
          set_number: 1,
          weight_lbs: 0,
          reps: 0,
          rpe: null
        }
      );

      const newExercise: LocalExercise = {
        ...sessionExercise,
        exercise: selectedExercise,
        sets: [firstSet]
      };

      setExercises(prev => [...prev, newExercise]);
      setShowExercisePicker(false);
    } catch (error) {
      console.error('Error adding exercise:', error);
      Alert.alert('Error', 'Failed to add exercise');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSet = async (sessionExerciseId: string) => {
    try {
      setSaving(true);
      const exercise = exercises.find(e => e.id === sessionExerciseId);
      if (!exercise) return;

      const setNumber = exercise.sets.length + 1;
      const newSet = await workoutSessionService.addSetToExercise(
        sessionExerciseId,
        {
          set_number: setNumber,
          weight_lbs: 0,
          reps: 0,
          rpe: null
        }
      );

      setExercises(prev =>
        prev.map(ex =>
          ex.id === sessionExerciseId
            ? { ...ex, sets: [...ex.sets, newSet] }
            : ex
        )
      );
    } catch (error) {
      console.error('Error adding set:', error);
      Alert.alert('Error', 'Failed to add set');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSet = async (
    setId: string,
    sessionExerciseId: string,
    updates: Partial<ExerciseSet>
  ) => {
    try {
      // Optimistically update UI
      setExercises(prev =>
        prev.map(ex =>
          ex.id === sessionExerciseId
            ? {
                ...ex,
                sets: ex.sets.map(s =>
                  s.id === setId ? { ...s, ...updates } : s
                )
              }
            : ex
        )
      );

      // Update in database
      await workoutSessionService.updateSet(setId, updates);
    } catch (error) {
      console.error('Error updating set:', error);
      await loadSession();
    }
  };

  const handleDeleteSet = async (setId: string, sessionExerciseId: string) => {
    try {
      const exercise = exercises.find(e => e.id === sessionExerciseId);
      if (!exercise || exercise.sets.length < 2) {
        Alert.alert('Cannot Delete', 'Each exercise must have at least one set.');
        return;
      }

      await workoutSessionService.deleteSet(setId);

      // Filter out the deleted set and renumber remaining sets
      setExercises(prev =>
        prev.map(ex => {
          if (ex.id === sessionExerciseId) {
            const filteredSets = ex.sets.filter(s => s.id !== setId);
            // Renumber sets sequentially
            const renumberedSets = filteredSets.map((set, index) => ({
              ...set,
              set_number: index + 1
            }));

            // Update set numbers in database
            renumberedSets.forEach(async (set, index) => {
              if (set.set_number !== ex.sets.find(s => s.id === set.id)?.set_number) {
                await workoutSessionService.updateSet(set.id, { set_number: index + 1 });
              }
            });

            return { ...ex, sets: renumberedSets };
          }
          return ex;
        })
      );
    } catch (error) {
      console.error('Error deleting set:', error);
      Alert.alert('Error', 'Failed to delete set');
    }
  };

  const handleDeleteExercise = async (sessionExerciseId: string) => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise and all its sets?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              await workoutSessionService.removeExerciseFromSession(sessionExerciseId);
              setExercises(prev => prev.filter(ex => ex.id !== sessionExerciseId));
            } catch (error) {
              console.error('Error deleting exercise:', error);
              Alert.alert('Error', 'Failed to delete exercise');
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  };

  const handleFinishWorkout = async () => {
    if (!sessionId) return;

    const hasCompletedSets = exercises.some(ex => ex.sets.some(s => s.completed));
    
    if (!hasCompletedSets) {
      Alert.alert(
        'No Sets Completed',
        'You haven\'t completed any sets. Are you sure you want to finish this workout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Finish Anyway', onPress: () => completeWorkout() }
        ]
      );
      return;
    }

    completeWorkout();
  };

  const completeWorkout = async () => {
    if (!sessionId) return;

    try {
      setSaving(true);
      await workoutSessionService.completeSession(sessionId, notes);
      await endWorkout();
      
      Alert.alert(
        'Workout Complete!',
        'Great job! Your workout has been saved.',
        [
          {
            text: 'View History',
            onPress: () => router.replace('/(athlete)/history')
          },
          {
            text: 'Go Home',
            onPress: () => router.replace('/(athlete)')
          }
        ]
      );
    } catch (error) {
      console.error('Error completing workout:', error);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Workout',
      'Are you sure you want to cancel this workout? All progress will be lost.',
      [
        { text: 'Keep Working Out', style: 'cancel' },
        {
          text: 'Cancel Workout',
          style: 'destructive',
          onPress: async () => {
            try {
              if (sessionId) {
                await workoutSessionService.deleteSession(sessionId);
                await endWorkout();
              }
              router.replace('/(athlete)');
            } catch (error) {
              console.error('Error canceling workout:', error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray10" mt="$3">
            Loading workout...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <YStack f={1} backgroundColor="#f5f5f5">
          {/* Header */}
          <XStack backgroundColor="white" p="$4" ai="center" jc="space-between" borderBottomWidth={1} borderBottomColor="#e5e7eb">
            <Button
              size="$3"
              chromeless
              onPress={handleCancel}
              disabled={saving}
              accessibilityLabel="Cancel workout"
            >
              <Trash2 size={24} color="#ef4444" />
            </Button>

            <YStack ai="center" gap="$1">
              <XStack ai="center" gap="$2">
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  {session?.name || 'Workout'}
                </Text>
                <ChevronDown size={20} color="#9ca3af" />
              </XStack>
              <XStack ai="center" gap="$2">
                <Clock size={16} color="#7c3aed" />
                <Text fontSize="$3" fontWeight="600" color="#7c3aed">
                  {formatTime(elapsedTime)}
                </Text>
              </XStack>
            </YStack>

            <Button
              size="$3"
              backgroundColor="#16a34a"
              color="white"
              onPress={handleFinishWorkout}
              disabled={saving}
              pressStyle={{ backgroundColor: '#15803d' }}
            >
              {saving ? <Spinner size="small" color="white" /> : <Save size={20} color="white" />}
            </Button>
          </XStack>

          <ScrollView>
            <YStack p="$4" gap="$3" pb="$24">
              {/* Exercises */}
              {exercises.map((exercise) => (
                <Card key={exercise.id} elevate size="$4" p="$4" backgroundColor="white">
                  <YStack gap="$3">
                    <XStack ai="center" jc="space-between">
                      <YStack f={1} gap="$1">
                        <Text fontSize="$5" fontWeight="bold" color="$gray12">
                          {exercise.exercise.name}
                        </Text>
                        <Text fontSize="$2" color="$gray10" textTransform="capitalize">
                          {exercise.exercise.category.replace('_', ' ')}
                        </Text>
                      </YStack>
                      <Button
                        size="$2"
                        chromeless
                        icon={Trash2}
                        color="#ef4444"
                        onPress={() => handleDeleteExercise(exercise.id)}
                        disabled={saving}
                      />
                    </XStack>

                    {/* Sets */}
<YStack gap="$2">
  {exercise.sets.map((set, setIndex) => {
    const locked = !!set.completed;

    return (
      <Swipeable
        key={set.id}
        renderRightActions={() =>
          renderRightActions(() => handleDeleteSet(set.id, exercise.id))
        }
        overshootRight={false}
        enabled={exercise.sets.length > 1}
        containerStyle={{ borderRadius: 8 }}
      >
        <XStack
          ai="center"
          gap="$2.5"
          backgroundColor={locked ? '#f0fdf4' : '#fafafa'}
          borderRadius="$3"
          p="$3"
          borderWidth={locked ? 2 : 1}
          borderColor={locked ? '#86efac' : '#e5e7eb'}
          opacity={locked ? 0.85 : 1}
        >
          {/* Set label */}
          <YStack minWidth={42} ai="center">
            <Text fontSize="$1" color="$gray9" fontWeight="600" mb="$1">
              SET
            </Text>
            <Text fontSize="$5" color={locked ? '#16a34a' : '#7c3aed'} fontWeight="bold">
              {set.set_number}
            </Text>
          </YStack>

          {/* Weight (lbs) */}
          <YStack f={1}>
            <Text fontSize="$1" color="$gray9" fontWeight="600" mb="$1.5" textTransform="uppercase">
              Weight
            </Text>
            <TextInput
              style={{
                backgroundColor: locked ? '#f9fafb' : 'white',
                borderWidth: 2,
                borderColor: locked ? '#e5e7eb' : '#d1d5db',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 12,
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
                color: locked ? '#9ca3af' : '#1f2937',
              }}
              placeholder="0"
              placeholderTextColor="#d1d5db"
              keyboardType="numeric"
              value={set.weight_lbs ? String(set.weight_lbs) : ''}
              onChangeText={(text) => {
                if (locked) return;
                const weight = Number.parseInt(text || '0', 10) || 0;
                handleUpdateSet(set.id, exercise.id, { weight_lbs: weight });
              }}
              editable={!locked && !saving}
            />
            <Text fontSize="$1" color="$gray8" mt="$1" textAlign="center">
              lbs
            </Text>
          </YStack>

          {/* Reps */}
          <YStack f={1}>
            <Text fontSize="$1" color="$gray9" fontWeight="600" mb="$1.5" textTransform="uppercase">
              Reps
            </Text>
            <TextInput
              style={{
                backgroundColor: locked ? '#f9fafb' : 'white',
                borderWidth: 2,
                borderColor: locked ? '#e5e7eb' : '#d1d5db',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 12,
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
                color: locked ? '#9ca3af' : '#1f2937',
              }}
              placeholder="0"
              placeholderTextColor="#d1d5db"
              keyboardType="numeric"
              value={set.reps ? String(set.reps) : ''}
              onChangeText={(text) => {
                if (locked) return;
                const reps = Number.parseInt(text || '0', 10) || 0;
                handleUpdateSet(set.id, exercise.id, { reps });
              }}
              editable={!locked && !saving}
            />
            <Text fontSize="$1" color="$gray8" mt="$1" textAlign="center">
              reps
            </Text>
          </YStack>

          {/* RPE */}
          <YStack f={1}>
            <Text fontSize="$1" color="$gray9" fontWeight="600" mb="$1.5" textTransform="uppercase">
              RPE
            </Text>
            <TextInput
              style={{
                backgroundColor: locked ? '#f9fafb' : 'white',
                borderWidth: 2,
                borderColor: locked ? '#e5e7eb' : '#d1d5db',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 12,
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
                color: locked ? '#9ca3af' : '#1f2937',
              }}
              placeholder="8"
              placeholderTextColor="#d1d5db"
              keyboardType="numeric"
              value={
                typeof set.rpe === 'number' && set.rpe > 0 ? String(set.rpe) : ''
              }
              onChangeText={(text) => {
                if (locked) return;
                const rpe = Number.parseFloat(text);
                const safe = Number.isFinite(rpe) ? Math.max(1, Math.min(10, rpe)) : null;
                handleUpdateSet(set.id, exercise.id, { rpe: safe });
              }}
              editable={!locked && !saving}
            />
            <Text fontSize="$1" color="$gray8" mt="$1" textAlign="center">
              1-10
            </Text>
          </YStack>

          {/* Complete / Uncomplete toggle */}
          <YStack minWidth={48} ai="center">
            <TouchableOpacity
              onPress={() =>
                handleUpdateSet(set.id, exercise.id, { completed: !locked })
              }
              disabled={saving}
              accessibilityLabel={locked ? "Mark set as not completed" : "Mark set as completed"}
              style={{
                backgroundColor: locked ? '#16a34a' : '#f3f4f6',
                borderRadius: 8,
                padding: 10,
                shadowColor: locked ? '#16a34a' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: locked ? 0.3 : 0.1,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
              <Check size={24} color={locked ? 'white' : '#9ca3af'} />
            </TouchableOpacity>
          </YStack>
        </XStack>
      </Swipeable>
    );
  })}

  {/* Add Set Button */}
  <Button
    size="$3"
    backgroundColor="#f3f4f6"
    color="$gray12"
    icon={Plus}
    onPress={() => handleAddSet(exercise.id)}
    disabled={saving}
    pressStyle={{ backgroundColor: '#e5e7eb' }}
    borderRadius="$3"
  >
    <Text fontWeight="600">Add Set</Text>
  </Button>
</YStack>

                  </YStack>
                </Card>
              ))}

              {/* Add Exercise Button */}
              <Button
                size="$4"
                backgroundColor="white"
                borderColor="#7c3aed"
                borderWidth={2}
                borderStyle="dashed"
                color="#7c3aed"
                icon={Plus}
                onPress={() => setShowExercisePicker(true)}
                disabled={saving}
              >
                <Text>Add Exercise</Text>
              </Button>

              {/* Notes */}
              <Card elevate size="$4" p="$3" backgroundColor="white">
                <YStack gap="$2">
                  <Text fontSize="$4" fontWeight="600" color="$gray12">
                    Notes
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderColor: '#e5e7eb',
                      borderRadius: 8,
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      fontSize: 16,
                      minHeight: 80,
                      textAlignVertical: 'top',
                    }}
                    placeholder="How did you feel? Any achievements?"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                    editable={!saving}
                  />
                </YStack>
              </Card>
            </YStack>
          </ScrollView>

          {/* Exercise Selector Modal */}
          {showExercisePicker && (
            <ExerciseSelectorModal
              exercises={availableExercises}
              onSelect={handleAddExercise}
              onClose={() => setShowExercisePicker(false)}
              disabled={saving}
            />
          )}
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}