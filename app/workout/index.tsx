import { router } from 'expo-router';
import { Check, ChevronDown, Clock, Plus, Save, Trash2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Spinner, Text, XStack, YStack } from 'tamagui';
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

  const handleAddExercise = async (exerciseId: string) => {
    if (!sessionId) return;

    try {
      setSaving(true);
      const order = exercises.length;
      const sessionExercise = await workoutSessionService.addExerciseToSession(
        sessionId,
        exerciseId,
        order
      );

      const exercise = availableExercises.find(e => e.id === exerciseId);
      if (exercise) {
        const newExercise: LocalExercise = {
          ...sessionExercise,
          exercise,
          sets: []
        };
        setExercises(prev => [...prev, newExercise]);
      }
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
      'Delete this exercise and all its sets?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await workoutSessionService.removeExerciseFromSession(sessionExerciseId);
              setExercises(prev => prev.filter(ex => ex.id !== sessionExerciseId));
            } catch (error) {
              console.error('Error deleting exercise:', error);
              Alert.alert('Error', 'Failed to delete exercise');
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
        'You haven\'t completed any sets. Finish anyway?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Finish', onPress: () => completeWorkout() }
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
      endWorkout();
      
      Alert.alert(
        'Workout Complete!',
        'Great job! Your workout has been saved.',
        [
          {
            text: 'View History',
            onPress: () => {
              router.dismiss();
              router.push('/(athlete)/history');
            }
          },
          {
            text: 'Done',
            onPress: () => router.dismiss()
          }
        ]
      );
    } catch (error) {
      console.error('Error completing workout:', error);
      Alert.alert('Error', 'Failed to save workout');
    } finally {
      setSaving(false);
    }
  };

  const handleMinimize = () => {
    router.dismiss();
  };

  if (loading || !session) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <YStack f={1} backgroundColor="#fff">
          {/* Header */}
          <XStack
            backgroundColor="#7c3aed"
            p="$4"
            ai="center"
            jc="space-between"
          >
            <YStack f={1}>
              <Text fontSize="$6" fontWeight="bold" color="white">
                {session.name}
              </Text>
              <XStack ai="center" gap="$2">
                <Clock size={16} color="white" />
                <Text fontSize="$4" color="white" fontWeight="600">
                  {formatTime(elapsedTime)}
                </Text>
              </XStack>
            </YStack>
            <TouchableOpacity onPress={handleMinimize}>
              <ChevronDown size={28} color="white" />
            </TouchableOpacity>
          </XStack>

          <ScrollView style={{ flex: 1 }}>
            <YStack p="$4" gap="$4" pb={120}>
              {/* Exercises */}
              {exercises.map((exercise, exerciseIndex) => (
                <Card key={exercise.id} elevate size="$4" p="$3" backgroundColor="white">
                  <YStack gap="$3">
                    {/* Exercise Header */}
                    <XStack ai="center" jc="space-between">
                      <YStack f={1}>
                        <Text fontSize="$2" color="$gray10">
                          Exercise {exerciseIndex + 1}
                        </Text>
                        <Text fontSize="$5" fontWeight="bold" color="$gray12">
                          {exercise.exercise.name}
                        </Text>
                      </YStack>
                      <TouchableOpacity onPress={() => handleDeleteExercise(exercise.id)}>
                        <Trash2 size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </XStack>

                    {/* Set Headers */}
                    {exercise.sets.length > 0 && (
                      <XStack gap="$2" ai="center" px="$2">
                        <Text w={30} fontSize="$2" color="$gray10" fontWeight="600">
                          Set
                        </Text>
                        <Text f={1} fontSize="$2" color="$gray10" fontWeight="600" textAlign="center">
                          Lbs
                        </Text>
                        <Text f={1} fontSize="$2" color="$gray10" fontWeight="600" textAlign="center">
                          Reps
                        </Text>
                        <Text f={1} fontSize="$2" color="$gray10" fontWeight="600" textAlign="center">
                          RPE
                        </Text>
                        <YStack w={40} />
                      </XStack>
                    )}

                    {/* Sets */}
                    {exercise.sets.map((set, setIndex) => (
                      <XStack key={set.id} gap="$2" ai="center">
                        {/* Set Number */}
                        <YStack
                          w={30}
                          h={40}
                          borderRadius="$2"
                          backgroundColor={set.completed ? '#7c3aed' : '#f3f4f6'}
                          ai="center"
                          jc="center"
                        >
                          <Text
                            fontSize="$3"
                            fontWeight="bold"
                            color={set.completed ? 'white' : '$gray11'}
                          >
                            {setIndex + 1}
                          </Text>
                        </YStack>

                        {/* Weight */}
                        <YStack f={1}>
                          <TextInput
                            style={{
                              backgroundColor: set.completed ? '#f0fdf4' : '#fff',
                              borderWidth: 1,
                              borderColor: set.completed ? '#86efac' : '#e5e7eb',
                              borderRadius: 8,
                              paddingVertical: 10,
                              paddingHorizontal: 12,
                              fontSize: 16,
                              textAlign: 'center',
                            }}
                            placeholder="0"
                            value={set.weight_lbs > 0 ? set.weight_lbs.toString() : ''}
                            onChangeText={(val) => {
                              const weight = parseFloat(val) || 0;
                              handleUpdateSet(set.id, exercise.id, { weight_lbs: weight });
                            }}
                            keyboardType="decimal-pad"
                            editable={!set.completed}
                          />
                        </YStack>

                        {/* Reps */}
                        <YStack f={1}>
                          <TextInput
                            style={{
                              backgroundColor: set.completed ? '#f0fdf4' : '#fff',
                              borderWidth: 1,
                              borderColor: set.completed ? '#86efac' : '#e5e7eb',
                              borderRadius: 8,
                              paddingVertical: 10,
                              paddingHorizontal: 12,
                              fontSize: 16,
                              textAlign: 'center',
                            }}
                            placeholder="0"
                            value={set.reps > 0 ? set.reps.toString() : ''}
                            onChangeText={(val) => {
                              const reps = parseInt(val) || 0;
                              handleUpdateSet(set.id, exercise.id, { reps });
                            }}
                            keyboardType="number-pad"
                            editable={!set.completed}
                          />
                        </YStack>

                        {/* RPE */}
                        <YStack f={1}>
                          <TextInput
                            style={{
                              backgroundColor: set.completed ? '#f0fdf4' : '#fff',
                              borderWidth: 1,
                              borderColor: set.completed ? '#86efac' : '#e5e7eb',
                              borderRadius: 8,
                              paddingVertical: 10,
                              paddingHorizontal: 12,
                              fontSize: 16,
                              textAlign: 'center',
                            }}
                            placeholder="0"
                            value={set.rpe ? set.rpe.toString() : ''}
                            onChangeText={(val) => {
                              const rpe = parseFloat(val) || null;
                              handleUpdateSet(set.id, exercise.id, { rpe });
                            }}
                            keyboardType="decimal-pad"
                            editable={!set.completed}
                          />
                        </YStack>

                        {/* Actions */}
                        <YStack w={40}>
                          {set.completed ? (
                            <TouchableOpacity
                              onPress={() => handleUpdateSet(set.id, exercise.id, { completed: false })}
                            >
                              <X size={24} color="#6b7280" />
                            </TouchableOpacity>
                          ) : set.weight_lbs > 0 && set.reps > 0 ? (
                            <TouchableOpacity
                              onPress={() => handleUpdateSet(set.id, exercise.id, { completed: true })}
                            >
                              <Check size={24} color="#16a34a" />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={() => handleDeleteSet(set.id, exercise.id)}>
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
                      Add Set
                    </Button>
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
                Add Exercise
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
                    placeholder="How did you feel?"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                  />
                </YStack>
              </Card>
            </YStack>
          </ScrollView>

          {/* Exercise Picker Modal */}
          {showExercisePicker && (
            <YStack
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              backgroundColor="rgba(0,0,0,0.5)"
              ai="center"
              jc="center"
              p="$4"
              zIndex={20}
            >
              <YStack
                backgroundColor="white"
                borderRadius="$4"
                p="$4"
                maxHeight="80%"
                w="100%"
                maxWidth={400}
                gap="$3"
              >
                <XStack ai="center" jc="space-between">
                  <Text fontSize="$5" fontWeight="bold">Select Exercise</Text>
                  <TouchableOpacity onPress={() => setShowExercisePicker(false)}>
                    <X size={24} color="#6b7280" />
                  </TouchableOpacity>
                </XStack>
                
                <ScrollView>
                  <YStack gap="$2">
                    {availableExercises.map((ex) => (
                      <TouchableOpacity
                        key={ex.id}
                        onPress={() => handleAddExercise(ex.id)}
                        disabled={saving}
                      >
                        <YStack
                          backgroundColor="white"
                          borderWidth={1}
                          borderColor="#e5e7eb"
                          borderRadius="$3"
                          p="$3"
                          gap="$1"
                        >
                          <Text fontSize="$4" fontWeight="600">{ex.name}</Text>
                          <Text fontSize="$2" color="$gray10">{ex.category}</Text>
                        </YStack>
                      </TouchableOpacity>
                    ))}
                  </YStack>
                </ScrollView>
              </YStack>
            </YStack>
          )}

          {/* Finish Button */}
          <YStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            p="$4"
            backgroundColor="white"
            borderTopWidth={1}
            borderTopColor="#e5e7eb"
            pointerEvents={showExercisePicker ? 'none' : 'auto'}
            zIndex={10}
          >
            <Button
              size="$5"
              backgroundColor="#16a34a"
              color="white"
              icon={Save}
              onPress={handleFinishWorkout}
              disabled={saving}
              pressStyle={{ backgroundColor: '#15803d' }}
            >
              {saving ? 'Saving...' : 'Finish Workout'}
            </Button>
          </YStack>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}