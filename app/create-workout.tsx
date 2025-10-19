import { router } from 'expo-router';
import { ArrowLeft, Dumbbell, Plus, Save, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';

type Exercise = {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
};

export default function CreateWorkoutScreen() {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', name: '', sets: '', reps: '', weight: '' }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      { id: Date.now().toString(), name: '', sets: '', reps: '', weight: '' }
    ]);
  };

  const handleRemoveExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter(ex => ex.id !== id));
    }
  };

  const handleExerciseChange = (id: string, field: keyof Exercise, value: string) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSave = async () => {
    if (!workoutName.trim()) {
      alert('Please enter a workout name');
      return;
    }

    const validExercises = exercises.filter(ex => ex.name.trim());
    if (validExercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    setIsSaving(true);
    // TODO: Save to backend/database
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving workout:', { name: workoutName, exercises: validExercises });
    setIsSaving(false);
    alert('Workout created successfully!');
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <YStack f={1} backgroundColor="#f5f5f5">
          {/* Header */}
          <XStack backgroundColor="#f5f5f5" p="$4" ai="center" gap="$3">
            <Button
              size="$3"
              chromeless
              onPress={handleBack}
              pressStyle={{ opacity: 0.7 }}
            >
              <ArrowLeft size={24} color="#6b7280" />
            </Button>
            <Text fontSize="$7" fontWeight="bold" color="$gray12">
              Create Workout
            </Text>
          </XStack>

          <ScrollView>
            <YStack p="$4" gap="$4">
              {/* Workout Name */}
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <XStack ai="center" gap="$2">
                    <Dumbbell size={20} color="#7c3aed" />
                    <Text fontSize="$4" fontWeight="600" color="$gray12">
                      Workout Name
                    </Text>
                  </XStack>
                  <Input
                    size="$4"
                    value={workoutName}
                    onChangeText={setWorkoutName}
                    placeholder="e.g. Upper Body A"
                    borderColor="#e9d5ff"
                    focusStyle={{ borderColor: '#7c3aed' }}
                  />
                </YStack>
              </Card>

              {/* Exercises Section */}
              <YStack gap="$3">
                <XStack ai="center" jc="space-between">
                  <Text fontSize="$5" fontWeight="bold" color="$gray12">
                    Exercises
                  </Text>
                  <Button
                    size="$3"
                    chromeless
                    color="#7c3aed"
                    fontWeight="600"
                    onPress={handleAddExercise}
                    pressStyle={{ opacity: 0.7 }}
                  >
                    <XStack ai="center" gap="$1">
                      <Plus size={16} color="#7c3aed" />
                      <Text color="#7c3aed" fontWeight="600">Add</Text>
                    </XStack>
                  </Button>
                </XStack>

                {exercises.map((exercise, index) => (
                  <Card key={exercise.id} elevate size="$4" p="$4" backgroundColor="white">
                    <YStack gap="$3">
                      {/* Exercise Header */}
                      <XStack ai="center" jc="space-between">
                        <Text fontSize="$4" fontWeight="600" color="$gray12">
                          Exercise {index + 1}
                        </Text>
                        {exercises.length > 1 && (
                          <Button
                            size="$3"
                            chromeless
                            onPress={() => handleRemoveExercise(exercise.id)}
                            pressStyle={{ opacity: 0.7 }}
                          >
                            <Trash2 size={18} color="#ef4444" />
                          </Button>
                        )}
                      </XStack>

                      {/* Exercise Name */}
                      <YStack gap="$2">
                        <Text fontSize="$3" color="$gray11">
                          Exercise Name
                        </Text>
                        <Input
                          size="$4"
                          value={exercise.name}
                          onChangeText={(val) => handleExerciseChange(exercise.id, 'name', val)}
                          placeholder="e.g. Bench Press"
                          borderColor="#e9d5ff"
                          focusStyle={{ borderColor: '#7c3aed' }}
                        />
                      </YStack>

                      {/* Sets, Reps, Weight */}
                      <XStack gap="$3">
                        <YStack f={1} gap="$2">
                          <Text fontSize="$3" color="$gray11">
                            Sets
                          </Text>
                          <Input
                            size="$4"
                            value={exercise.sets}
                            onChangeText={(val) => handleExerciseChange(exercise.id, 'sets', val)}
                            placeholder="4"
                            keyboardType="number-pad"
                            borderColor="#e9d5ff"
                            focusStyle={{ borderColor: '#7c3aed' }}
                          />
                        </YStack>
                        <YStack f={1} gap="$2">
                          <Text fontSize="$3" color="$gray11">
                            Reps
                          </Text>
                          <Input
                            size="$4"
                            value={exercise.reps}
                            onChangeText={(val) => handleExerciseChange(exercise.id, 'reps', val)}
                            placeholder="8"
                            keyboardType="number-pad"
                            borderColor="#e9d5ff"
                            focusStyle={{ borderColor: '#7c3aed' }}
                          />
                        </YStack>
                        <YStack f={1} gap="$2">
                          <Text fontSize="$3" color="$gray11">
                            Weight
                          </Text>
                          <Input
                            size="$4"
                            value={exercise.weight}
                            onChangeText={(val) => handleExerciseChange(exercise.id, 'weight', val)}
                            placeholder="185"
                            keyboardType="decimal-pad"
                            borderColor="#e9d5ff"
                            focusStyle={{ borderColor: '#7c3aed' }}
                          />
                        </YStack>
                      </XStack>
                    </YStack>
                  </Card>
                ))}
              </YStack>

              {/* Save Button */}
              <Button
                size="$5"
                backgroundColor="#7c3aed"
                color="white"
                onPress={handleSave}
                disabled={isSaving}
                opacity={isSaving ? 0.5 : 1}
                pressStyle={{ backgroundColor: '#6d28d9' }}
                mt="$2"
              >
                <XStack ai="center" gap="$2">
                  <Save size={20} color="white" />
                  <Text fontSize="$5" fontWeight="bold" color="white">
                    {isSaving ? 'Saving...' : 'Save Workout'}
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </ScrollView>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}