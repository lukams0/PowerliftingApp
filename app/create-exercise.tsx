import { router } from 'expo-router';
import { ArrowLeft, Dumbbell, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Text, TextArea, XStack, YStack } from 'tamagui';

const categories = ['Legs', 'Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Full Body'];

export default function CreateExerciseScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter an exercise name');
      return;
    }

    if (!category) {
      alert('Please select a category');
      return;
    }

    setIsSaving(true);
    // TODO: Save to backend/database
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving exercise:', { name, category, description, notes });
    setIsSaving(false);
    alert('Exercise created successfully!');
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
              Create Exercise
            </Text>
          </XStack>

          <ScrollView>
            <YStack p="$4" gap="$4">
              {/* Exercise Name */}
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <XStack ai="center" gap="$2">
                    <Dumbbell size={20} color="#7c3aed" />
                    <Text fontSize="$4" fontWeight="600" color="$gray12">
                      Exercise Name
                    </Text>
                  </XStack>
                  <Input
                    size="$4"
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Barbell Squat"
                    borderColor="#e9d5ff"
                    focusStyle={{ borderColor: '#7c3aed' }}
                  />
                </YStack>
              </Card>

              {/* Category */}
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <Text fontSize="$4" fontWeight="600" color="$gray12">
                    Category
                  </Text>
                  <XStack gap="$2" flexWrap="wrap">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        size="$3"
                        backgroundColor={category === cat ? '#7c3aed' : 'white'}
                        color={category === cat ? 'white' : '$gray11'}
                        borderColor="#e9d5ff"
                        borderWidth={1}
                        onPress={() => setCategory(cat)}
                        pressStyle={{ opacity: 0.8 }}
                      >
                        {cat}
                      </Button>
                    ))}
                  </XStack>
                </YStack>
              </Card>

              {/* Description */}
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <Text fontSize="$4" fontWeight="600" color="$gray12">
                    Description
                  </Text>
                  <Text fontSize="$3" color="$gray10">
                    Brief description of the exercise
                  </Text>
                  <TextArea
                    size="$4"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="e.g. A compound lower body exercise..."
                    borderColor="#e9d5ff"
                    focusStyle={{ borderColor: '#7c3aed' }}
                    numberOfLines={4}
                  />
                </YStack>
              </Card>

              {/* Form Notes */}
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <Text fontSize="$4" fontWeight="600" color="$gray12">
                    Form Notes (Optional)
                  </Text>
                  <Text fontSize="$3" color="$gray10">
                    Tips and cues for proper form
                  </Text>
                  <TextArea
                    size="$4"
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="e.g. Keep chest up, depth to parallel..."
                    borderColor="#e9d5ff"
                    focusStyle={{ borderColor: '#7c3aed' }}
                    numberOfLines={4}
                  />
                </YStack>
              </Card>

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
                    {isSaving ? 'Saving...' : 'Save Exercise'}
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