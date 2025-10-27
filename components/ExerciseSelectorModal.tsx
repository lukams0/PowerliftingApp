import { Search, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { TextInput as RNTextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Card, Text, XStack, YStack } from 'tamagui';
import { Exercise } from '../types/database.types';

const CATEGORIES = ['All', 'Legs', 'Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Full Body'];

interface ExerciseSelectorModalProps {
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
  disabled?: boolean;
}

export function ExerciseSelectorModal({ 
  exercises, 
  onSelect, 
  onClose,
  disabled = false 
}: ExerciseSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter exercises based on search and category
  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (exercise) => exercise.category.toLowerCase() === selectedCategory.toLowerCase().replace(' ', '_')
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((exercise) =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [exercises, searchQuery, selectedCategory]);

  return (
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
      zIndex={1000}
    >
      <Card
        elevate
        size="$4"
        p="$4"
        backgroundColor="white"
        maxHeight="90%"
        w="100%"
        maxWidth={500}
        f={1}
      >
        <YStack gap="$3" f={1}>
          {/* Header */}
          <XStack ai="center" jc="space-between">
            <Text fontSize="$6" fontWeight="bold" color="$gray12">
              Select Exercise
            </Text>
            <Button
              size="$3"
              chromeless
              icon={X}
              onPress={onClose}
              disabled={disabled}
            />
          </XStack>

          {/* Search Bar */}
          <XStack
            ai="center"
            gap="$2"
            backgroundColor="#f9fafb"
            borderRadius="$3"
            borderWidth={1}
            borderColor="#e5e7eb"
            px="$3"
            py="$2"
          >
            <Search size={20} color="#6b7280" />
            <RNTextInput
              style={{
                flex: 1,
                fontSize: 16,
                color: '#111827',
                paddingVertical: 4,
              }}
              placeholder="Search exercises..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              editable={!disabled}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} disabled={disabled}>
                <X size={18} color="#6b7280" />
              </TouchableOpacity>
            )}
          </XStack>

          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingVertical: 4 }}
          >
            <XStack gap="$2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  size="$3"
                  backgroundColor={selectedCategory === category ? '#7c3aed' : 'white'}
                  borderColor={selectedCategory === category ? '#7c3aed' : '#e5e7eb'}
                  borderWidth={1}
                  color={selectedCategory === category ? 'white' : '$gray12'}
                  onPress={() => setSelectedCategory(category)}
                  disabled={disabled}
                  pressStyle={{ 
                    backgroundColor: selectedCategory === category ? '#6d28d9' : '#f9fafb' 
                  }}
                >
                  {category}
                </Button>
              ))}
            </XStack>
          </ScrollView>

          <YStack gap="$2" f={1}>
            {/* Results Count */}
            <Text fontSize="$2" color="$gray10">
              {filteredExercises.length} {filteredExercises.length === 1 ? 'exercise' : 'exercises'}
            </Text>

            {/* Exercise List */}
            <ScrollView
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              <YStack gap="$2">
                {filteredExercises.length === 0 ? (
                  <YStack ai="center" py="$8" gap="$2">
                    <Text fontSize="$4" color="$gray10" textAlign="center">
                      No exercises found
                    </Text>
                    <Text fontSize="$3" color="$gray9" textAlign="center">
                      Try adjusting your search or filter
                    </Text>
                  </YStack>
                ) : (
                  filteredExercises.map((exercise) => (
                    <TouchableOpacity
                      key={exercise.id}
                      onPress={() => onSelect(exercise)}
                      disabled={disabled}
                    >
                      <YStack
                        backgroundColor="white"
                        borderWidth={1}
                        borderColor="#e5e7eb"
                        borderRadius="$3"
                        p="$3"
                        gap="$2"
                        pressStyle={{ backgroundColor: '#f9fafb' }}
                      >
                        <Text fontSize="$4" fontWeight="600" color="$gray12">
                          {exercise.name}
                        </Text>
                        <Text
                          fontSize="$2"
                          color="$gray10"
                          textTransform="capitalize"
                        >
                          {exercise.category.replace('_', ' ')}
                        </Text>
                        {exercise.description && (
                          <Text
                            fontSize="$2"
                            color="$gray9"
                            numberOfLines={2}
                          >
                            {exercise.description}
                          </Text>
                        )}
                      </YStack>
                    </TouchableOpacity>
                  ))
                )}
              </YStack>
            </ScrollView>
          </YStack>
        </YStack>
      </Card>
    </YStack>
  );
}