import { router, useLocalSearchParams } from 'expo-router';
import { Check, Clock, Plus, Save, Trash2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Spinner, Text, XStack, YStack } from 'tamagui';
import { useAuth } from '../../../contexts/AuthContext';
import { exerciseService } from '../../../services/exercise.service';
import {
    ExerciseSet,
    SessionExercise,
    WorkoutSessionWithDetails,
    workoutSessionService
} from '../../../services/workoutsession.service';
import { Exercise } from '../../../types/database.types';

interface LocalExercise extends SessionExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
}

export default function ActiveSessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { user } = useAuth();
  const [session, setSession] = useState<WorkoutSessionWithDetails | null>(null);
  const [exercises, setExercises] = useState<LocalExercise[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [notes, setNotes] = useState('');

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && session) {
      const startTime = new Date(session.start_time).getTime();
      interval = setInterval(() => {
        const now = Date.now();
        setElapsedTime(Math.floor((now - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, session]);

  // Load session data
  useEffect(() => {
    loadSession();
    loadAvailableExercises();
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
      // Reload on error
      await loadSession();
    }
  };

  const handleToggleSetComplete = (setId: string, sessionExerciseId: string, currentState: boolean) => {
    handleUpdateSet(setId, sessionExerciseId, { completed: !currentState });
  };

  const handleDeleteSet = async (setId: string, sessionExerciseId: string) => {
    try {
      setSaving(true);
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
    } finally {
      setSaving(false);
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

    // Check if at least one set is completed
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
      setIsRunning(false);
      
      // Complete the session
      await workoutSessionService.completeSession(sessionId, notes);
      
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
      setIsRunning(true);
    } finally {
      setSaving(false);
    }
  };

  const handleMinimize = () => {
    Alert.alert(
      'Minimize Workout',
      'Your workout progress is automatically saved. Return to home?',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Go Home', onPress: () => router.back() }
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

  if (!session) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center" p="$4">
          <Text fontSize="$5" fontWeight="bold" color="$gray12" textAlign="center">
            Workout Not Found
          </Text>
          <Button
            size="$4"
            backgroundColor="#7c3aed"
            color="white"
            onPress={() => router.back()}
            mt="$4"
          >
            Go Back
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        {/* Header */}
        <XStack
          backgroundColor="white"
          p="$4"
          ai="center"
          jc="space-between"
          borderBottomWidth={1}
          borderBottomColor="#e5e7eb"
        >
          <YStack f={1}>
            <Text fontSize="$7" fontWeight="bold" color="$gray12">
              {session.name}
            </Text>
            <XStack ai="center" gap="$2">
              <Clock size={16} color="#7c3aed" />
              <Text fontSize="$4" color="#7c3aed" fontWeight="600">
                {formatTime(elapsedTime)}
              </Text>
            </XStack>
          </YStack>
          <Button
            size="$3"
            chromeless
            onPress={handleMinimize}
            pressStyle={{ opacity: 0.7 }}
            disabled={saving}
          >
            <X size={24} color="#6b7280" />
          </Button>
        </XStack>

        <ScrollView>
          <YStack p="$4" gap="$4" pb="$32">
            {/* Exercises */}
            {exercises.map((exercise, exerciseIndex) => (
              <Card key={exercise.id} elevate size="$4" p="$4" backgroundColor="white">
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
                    <Button
                      size="$2"
                      chromeless
                      icon={Trash2}
                      onPress={() => handleDeleteExercise(exercise.id)}
                      disabled={saving}
                    />
                  </XStack>

                  {/* Set Headers */}
                  {exercise.sets.length > 0 && (
                    <XStack gap="$2" ai="center">
                      <XStack w={40} />
                      <Text f={1} fontSize="$2" color="$gray10" textAlign="center">
                        Weight (lbs)
                      </Text>
                      <Text f={1} fontSize="$2" color="$gray10" textAlign="center">
                        Reps
                      </Text>
                      <Text f={1} fontSize="$2" color="$gray10" textAlign="center">
                        RPE
                      </Text>
                      <XStack w={40} />
                    </XStack>
                  )}

                  {/* Sets */}
                  {exercise.sets.map((set, setIndex) => (
                    <XStack key={set.id} gap="$2" ai="center">
                      {/* Set Number */}
                      <XStack
                        w={40}
                        h={40}
                        borderRadius="$4"
                        backgroundColor={set.completed ? '#7c3aed' : '#f3f4f6'}
                        ai="center"
                        jc="center"
                      >
                        <Text
                          fontSize="$4"
                          fontWeight="bold"
                          color={set.completed ? 'white' : '$gray11'}
                        >
                          {setIndex + 1}
                        </Text>
                      </XStack>

                      {/* Weight Input */}
                      <XStack f={1}>
                        <Input
                          size="$4"
                          placeholder="0"
                          value={set.weight_lbs.toString()}
                          onChangeText={(val) => {
                            const weight = parseFloat(val) || 0;
                            handleUpdateSet(set.id, exercise.id, { weight_lbs: weight });
                          }}
                          keyboardType="decimal-pad"
                          textAlign="center"
                          backgroundColor={set.completed ? '#f0fdf4' : 'white'}
                          borderColor={set.completed ? '#86efac' : '#e5e7eb'}
                          disabled={set.completed || saving}
                        />
                      </XStack>

                      {/* Reps Input */}
                      <XStack f={1}>
                        <Input
                          size="$4"
                          placeholder="0"
                          value={set.reps.toString()}
                          onChangeText={(val) => {
                            const reps = parseInt(val) || 0;
                            handleUpdateSet(set.id, exercise.id, { reps });
                          }}
                          keyboardType="number-pad"
                          textAlign="center"
                          backgroundColor={set.completed ? '#f0fdf4' : 'white'}
                          borderColor={set.completed ? '#86efac' : '#e5e7eb'}
                          disabled={set.completed || saving}
                        />
                      </XStack>

                      {/* RPE Input */}
                      <XStack f={1}>
                        <Input
                          size="$4"
                          placeholder="0"
                          value={set.rpe?.toString() || ''}
                          onChangeText={(val) => {
                            const rpe = parseFloat(val) || null;
                            handleUpdateSet(set.id, exercise.id, { rpe });
                          }}
                          keyboardType="decimal-pad"
                          textAlign="center"
                          backgroundColor={set.completed ? '#f0fdf4' : 'white'}
                          borderColor={set.completed ? '#86efac' : '#e5e7eb'}
                          disabled={set.completed || saving}
                        />
                      </XStack>

                      {/* Complete/Delete Button */}
                      <XStack w={40}>
                        {set.completed ? (
                          <Button
                            size="$2"
                            chromeless
                            icon={X}
                            onPress={() => handleToggleSetComplete(set.id, exercise.id, set.completed)}
                            disabled={saving}
                          />
                        ) : set.weight_lbs > 0 && set.reps > 0 ? (
                          <Button
                            size="$2"
                            chromeless
                            icon={Check}
                            color="#16a34a"
                            onPress={() => handleToggleSetComplete(set.id, exercise.id, set.completed)}
                            disabled={saving}
                          />
                        ) : (
                          <Button
                            size="$2"
                            chromeless
                            icon={Trash2}
                            onPress={() => handleDeleteSet(set.id, exercise.id)}
                            disabled={saving}
                          />
                        )}
                      </XStack>
                    </XStack>
                  ))}

                  {/* Add Set Button */}
                  <Button
                    size="$3"
                    backgroundColor="white"
                    borderColor="#e5e7eb"
                    borderWidth={1}
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
            <Card elevate size="$4" p="$4" backgroundColor="white">
              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$gray12">
                  Workout Notes
                </Text>
                <Input
                  size="$4"
                  placeholder="How did you feel? Any achievements?"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
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
          >
            <Card
              elevate
              size="$4"
              p="$4"
              backgroundColor="white"
              maxHeight="80%"
              w="100%"
              maxWidth={400}
            >
              <YStack gap="$3" f={1}>
                <XStack ai="center" jc="space-between">
                  <Text fontSize="$5" fontWeight="bold">Select Exercise</Text>
                  <Button
                    size="$2"
                    chromeless
                    icon={X}
                    onPress={() => setShowExercisePicker(false)}
                  />
                </XStack>
                
                <ScrollView>
                  <YStack gap="$2">
                    {availableExercises.map((ex) => (
                      <Button
                        key={ex.id}
                        size="$4"
                        backgroundColor="white"
                        borderColor="#e5e7eb"
                        borderWidth={1}
                        color="$gray12"
                        justifyContent="flex-start"
                        onPress={() => handleAddExercise(ex.id)}
                        disabled={saving}
                      >
                        <YStack ai="flex-start">
                          <Text fontSize="$4" fontWeight="600">{ex.name}</Text>
                          <Text fontSize="$2" color="$gray10">{ex.category}</Text>
                        </YStack>
                      </Button>
                    ))}
                  </YStack>
                </ScrollView>
              </YStack>
            </Card>
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
    </SafeAreaView>
  );
}