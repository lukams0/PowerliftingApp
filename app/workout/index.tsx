import { router } from 'expo-router';
import { Check, ChevronDown, Clock, Plus, Save, Trash2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native';
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
      await workoutSessionService.deleteSet(setId);
      setExercises(prev =>
        prev.map(ex =>
          ex.id === sessionExerciseId
            ? { ...ex, sets: ex.sets.filter(s => s.id !== setId) }
            : ex
        )
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
            >
              <X size={24} color="#6b7280" />
            </Button>
            
            <YStack ai="center" gap="$1">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                {session?.name || 'Workout'}
              </Text>
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
                      {exercise.sets.map((set) => (
                        <XStack key={set.id} ai="center" gap="$3" backgroundColor="#f9fafb" borderRadius="$2" p="$2">
                          <Text fontSize="$3" color="$gray10" minWidth={60}>
                            Set {set.set_number}
                          </Text>
                          <TextInput
                            style={{
                              flex: 1,
                              backgroundColor: 'white',
                              borderWidth: 1,
                              borderColor: '#e5e7eb',
                              borderRadius: 6,
                              paddingVertical: 6,
                              paddingHorizontal: 10,
                              fontSize: 14,
                              textAlign: 'center',
                            }}
                            placeholder="lbs"
                            keyboardType="numeric"
                            value={set.weight_lbs > 0 ? set.weight_lbs.toString() : ''}
                            onChangeText={(text) => {
                              const weight = parseInt(text) || 0;
                              handleUpdateSet(set.id, exercise.id, { weight_lbs: weight });
                            }}
                            editable={!saving}
                          />
                          <Text fontSize="$3" color="$gray10">×</Text>
                          <TextInput
                            style={{
                              flex: 1,
                              backgroundColor: 'white',
                              borderWidth: 1,
                              borderColor: '#e5e7eb',
                              borderRadius: 6,
                              paddingVertical: 6,
                              paddingHorizontal: 10,
                              fontSize: 14,
                              textAlign: 'center',
                            }}
                            placeholder="reps"
                            keyboardType="numeric"
                            value={set.reps > 0 ? set.reps.toString() : ''}
                            onChangeText={(text) => {
                              const reps = parseInt(text) || 0;
                              handleUpdateSet(set.id, exercise.id, { reps });
                            }}
                            editable={!saving}
                          />
                          <YStack minWidth={40} ai="center">
                            {set.completed ? (
                              <TouchableOpacity
                                onPress={() => handleUpdateSet(set.id, exercise.id, { completed: false })}
                                disabled={saving}
                              >
                                <Check size={24} color="#16a34a" />
                              </TouchableOpacity>
                            ) : set.weight_lbs > 0 && set.reps > 0 ? (
                              <TouchableOpacity
                                onPress={() => handleUpdateSet(set.id, exercise.id, { completed: true })}
                                disabled={saving}
                              >
                                <ChevronDown size={24} color="#7c3aed" />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity 
                                onPress={() => handleDeleteSet(set.id, exercise.id)}
                                disabled={saving}
                              >
                                <Trash2 size={20} color="#ef4444" />
                              </TouchableOpacity>
                            )}
                          </YStack>
                        </XStack>
                      ))}

                      {/* Add Set Button */}
                      <Button
                        size="$3"
                        backgroundColor="#f3f4f6"
                        color="$gray12"
                        icon={Plus}
                        onPress={() => handleAddSet(exercise.id)}
                        disabled={saving}
                      >
                        <Text>Add Set</Text>
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