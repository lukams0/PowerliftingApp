import { router } from 'expo-router';
import { Check, Clock, Plus, Trash2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';

// Mock workout data
const initialWorkout = {
  id: 'w3-3',
  name: 'Upper Body B',
  exercises: [
    {
      id: 'ex1',
      name: 'Overhead Press',
      targetSets: 4,
      targetReps: '8',
      targetWeight: '115',
      sets: [
        { id: 's1', reps: '', weight: '', rpe: '', completed: false },
      ],
    },
    {
      id: 'ex2',
      name: 'Incline Bench Press',
      targetSets: 4,
      targetReps: '10',
      targetWeight: '165',
      sets: [
        { id: 's1', reps: '', weight: '', rpe: '', completed: false },
      ],
    },
  ],
};

export default function ActiveWorkoutScreen() {
  const [workout, setWorkout] = useState(initialWorkout);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMinimize = () => {
    // TODO: Store workout state and minimize
    router.back();
  };

  const handleAddSet = (exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                { id: `s${ex.sets.length + 1}`, reps: '', weight: '', rpe: '', completed: false }
              ]
            }
          : ex
      )
    }));
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter(s => s.id !== setId) }
          : ex
      )
    }));
  };

  const handleSetChange = (exerciseId: string, setId: string, field: string, value: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map(s =>
                s.id === setId ? { ...s, [field]: value } : s
              )
            }
          : ex
      )
    }));
  };

  const handleToggleSetComplete = (exerciseId: string, setId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map(s =>
                s.id === setId ? { ...s, completed: !s.completed } : s
              )
            }
          : ex
      )
    }));
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const handleFinishWorkout = () => {
    // TODO: Save workout data
    console.log('Workout finished:', workout);
    alert('Workout saved!');
    router.back();
  };

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
              {workout.name}
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
          >
            <X size={24} color="#6b7280" />
          </Button>
        </XStack>

        <ScrollView>
          <YStack p="$4" gap="$4" pb="$32">
            {workout.exercises.map((exercise, exerciseIndex) => (
              <Card key={exercise.id} elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  {/* Exercise Header */}
                  <XStack ai="center" jc="space-between">
                    <YStack f={1}>
                      <Text fontSize="$5" fontWeight="bold" color="$gray12">
                        {exercise.name}
                      </Text>
                      <Text fontSize="$3" color="$gray10">
                        Target: {exercise.targetSets} x {exercise.targetReps} @ {exercise.targetWeight} lbs
                      </Text>
                    </YStack>
                    <Button
                      size="$3"
                      chromeless
                      onPress={() => handleDeleteExercise(exercise.id)}
                      pressStyle={{ opacity: 0.7 }}
                    >
                      <Trash2 size={20} color="#ef4444" />
                    </Button>
                  </XStack>

                  {/* Set Headers */}
                  <XStack ai="center" gap="$2">
                    <XStack w={40} ai="center" jc="center">
                      <Text fontSize="$2" color="$gray10" fontWeight="600">
                        SET
                      </Text>
                    </XStack>
                    <XStack f={1} ai="center" jc="center">
                      <Text fontSize="$2" color="$gray10" fontWeight="600">
                        WEIGHT
                      </Text>
                    </XStack>
                    <XStack f={1} ai="center" jc="center">
                      <Text fontSize="$2" color="$gray10" fontWeight="600">
                        REPS
                      </Text>
                    </XStack>
                    <XStack f={1} ai="center" jc="center">
                      <Text fontSize="$2" color="$gray10" fontWeight="600">
                        RPE
                      </Text>
                    </XStack>
                    <XStack w={40} />
                  </XStack>

                  {/* Sets */}
                  {exercise.sets.map((set, setIndex) => (
                    <XStack key={set.id} ai="center" gap="$2">
                      {/* Set Number */}
                      <XStack
                        w={40}
                        h={40}
                        borderRadius="$10"
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
                          placeholder={exercise.targetWeight}
                          value={set.weight}
                          onChangeText={(val) => handleSetChange(exercise.id, set.id, 'weight', val)}
                          keyboardType="decimal-pad"
                          textAlign="center"
                          backgroundColor={set.completed ? '#f0fdf4' : 'white'}
                          borderColor={set.completed ? '#86efac' : '#e5e7eb'}
                          disabled={set.completed}
                        />
                      </XStack>

                      {/* Reps Input */}
                      <XStack f={1}>
                        <Input
                          size="$4"
                          placeholder={exercise.targetReps}
                          value={set.reps}
                          onChangeText={(val) => handleSetChange(exercise.id, set.id, 'reps', val)}
                          keyboardType="number-pad"
                          textAlign="center"
                          backgroundColor={set.completed ? '#f0fdf4' : 'white'}
                          borderColor={set.completed ? '#86efac' : '#e5e7eb'}
                          disabled={set.completed}
                        />
                      </XStack>

                      {/* RPE Input */}
                      <XStack f={1}>
                        <Input
                          size="$4"
                          placeholder="8"
                          value={set.rpe}
                          onChangeText={(val) => handleSetChange(exercise.id, set.id, 'rpe', val)}
                          keyboardType="decimal-pad"
                          textAlign="center"
                          backgroundColor={set.completed ? '#f0fdf4' : 'white'}
                          borderColor={set.completed ? '#86efac' : '#e5e7eb'}
                          disabled={set.completed}
                        />
                      </XStack>

                      {/* Complete/Delete Button */}
                      <XStack w={40}>
                        {set.completed ? (
                          <Button
                            size="$3"
                            chromeless
                            onPress={() => handleToggleSetComplete(exercise.id, set.id)}
                            pressStyle={{ opacity: 0.7 }}
                          >
                            <Check size={20} color="#16a34a" />
                          </Button>
                        ) : (
                          <Button
                            size="$3"
                            chromeless
                            circular
                            backgroundColor="#7c3aed"
                            onPress={() => handleToggleSetComplete(exercise.id, set.id)}
                            pressStyle={{ backgroundColor: '#6d28d9' }}
                            disabled={!set.weight || !set.reps}
                            opacity={!set.weight || !set.reps ? 0.3 : 1}
                          >
                            <Check size={16} color="white" />
                          </Button>
                        )}
                      </XStack>
                    </XStack>
                  ))}

                  {/* Add Set Button */}
                  <Button
                    size="$4"
                    backgroundColor="white"
                    borderColor="#e9d5ff"
                    borderWidth={2}
                    onPress={() => handleAddSet(exercise.id)}
                    pressStyle={{ backgroundColor: '#faf5ff' }}
                  >
                    <XStack ai="center" gap="$2">
                      <Plus size={18} color="#7c3aed" />
                      <Text fontSize="$4" fontWeight="600" color="#7c3aed">
                        Add Set
                      </Text>
                    </XStack>
                  </Button>
                </YStack>
              </Card>
            ))}

            {/* Add Exercise Button */}
            <Button
              size="$5"
              backgroundColor="white"
              borderColor="#e9d5ff"
              borderWidth={2}
              onPress={() => console.log('Add exercise')}
              pressStyle={{ backgroundColor: '#faf5ff' }}
            >
              <XStack ai="center" gap="$2">
                <Plus size={20} color="#7c3aed" />
                <Text fontSize="$5" fontWeight="600" color="#7c3aed">
                  Add Exercise
                </Text>
              </XStack>
            </Button>
          </YStack>
        </ScrollView>

        {/* Fixed Finish Button */}
        <YStack
          backgroundColor="white"
          borderTopWidth={1}
          borderTopColor="#e5e7eb"
          p="$4"
          pb="$2"
        >
          <Button
            size="$6"
            backgroundColor="#16a34a"
            color="white"
            borderRadius="$10"
            onPress={handleFinishWorkout}
            pressStyle={{ backgroundColor: '#15803d' }}
          >
            <XStack ai="center" gap="$2">
              <Check size={24} color="white" />
              <Text fontSize="$6" fontWeight="bold" color="white">
                Finish Workout
              </Text>
            </XStack>
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}