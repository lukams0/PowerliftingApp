import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, BookOpen, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Text, XStack, YStack } from 'tamagui';
import { useAuth } from '../../../contexts/AuthContext';
import { exerciseService } from '../../../services/exercise.service';
import { personalRecordService } from '../../../services/personalrecord.service';
import { Exercise, PersonalRecord } from '../../../types/database.types';

export default function ExerciseDetailPage() {
  const { exerciseId } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [prHistory, setPrHistory] = useState<PersonalRecord[]>([]);
  const [currentPR, setCurrentPR] = useState<PersonalRecord | null>(null);

  // Fetch exercise and PR data
  useEffect(() => {
    loadExerciseData();
  }, [exerciseId, user]);

  const loadExerciseData = async () => {
    if (!exerciseId || !user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch exercise details
      const exerciseData = await exerciseService.getExercise(exerciseId as string);
      if (!exerciseData) {
        setError('Exercise not found');
        return;
      }
      setExercise(exerciseData);

      // Fetch PR history
      const prHistoryData = await personalRecordService.getExercisePRHistory(
        user.id,
        exerciseId as string
      );
      setPrHistory(prHistoryData);

      // Get current PR (first in the list if exists)
      if (prHistoryData.length > 0) {
        const currentPRData = await personalRecordService.getExercisePR(
          user.id,
          exerciseId as string
        );
        setCurrentPR(currentPRData);
      }
    } catch (err) {
      console.error('Error loading exercise data:', err);
      setError('Failed to load exercise data');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format category for display
  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} backgroundColor="#f5f5f5" ai="center" jc="center">
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text mt="$4" color="$gray11">Loading exercise...</Text>
        </YStack>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !exercise) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} backgroundColor="#f5f5f5">
          <XStack backgroundColor="#f5f5f5" p="$4" ai="center" gap="$3">
            <Button size="$3" chromeless onPress={handleBack} pressStyle={{ opacity: 0.7 }}>
              <ArrowLeft size={24} color="#6b7280" />
            </Button>
            <Text fontSize="$7" fontWeight="bold" color="$gray12">Exercise</Text>
          </XStack>
          <YStack f={1} ai="center" jc="center" p="$4">
            <Text fontSize="$6" color="$red10" textAlign="center" mb="$4">
              {error || 'Exercise not found'}
            </Text>
            <Button onPress={handleBack} theme="purple">
              Go Back
            </Button>
          </YStack>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        {/* Header */}
        <XStack
          backgroundColor="#f5f5f5"
          p="$4"
          ai="center"
          gap="$3"
        >
          <Button
            size="$3"
            chromeless
            onPress={handleBack}
            pressStyle={{ opacity: 0.7 }}
          >
            <ArrowLeft size={24} color="#6b7280" />
          </Button>
          <YStack f={1}>
            <Text fontSize="$7" fontWeight="bold" color="$gray12">
              {exercise.name}
            </Text>
            <Text fontSize="$3" color="$gray10">
              {formatCategory(exercise.category)}
            </Text>
          </YStack>
        </XStack>

        <ScrollView>
          <YStack p="$4" gap="$4">
            {/* PR Card */}
            {currentPR ? (
              <Card elevate size="$4" p="$4" backgroundColor="#7c3aed">
                <YStack gap="$3">
                  <XStack ai="center" gap="$2">
                    <TrendingUp size={20} color="white" />
                    <Text fontSize="$3" color="white" fontWeight="600">
                      PERSONAL RECORD
                    </Text>
                  </XStack>
                  <XStack ai="flex-end" gap="$2">
                    <Text fontSize="$10" fontWeight="bold" color="white">
                      {currentPR.weight_lbs} lbs
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                    {currentPR.reps} {currentPR.reps === 1 ? 'rep' : 'reps'} • Set on {formatDate(currentPR.achieved_at)}
                  </Text>
                </YStack>
              </Card>
            ) : (
              <Card elevate size="$4" p="$4" backgroundColor="white" borderWidth={2} borderColor="#e5e7eb" borderStyle="dashed">
                <YStack gap="$2" ai="center" py="$3">
                  <TrendingUp size={24} color="#9ca3af" />
                  <Text fontSize="$4" color="$gray11" textAlign="center">
                    No PR recorded yet
                  </Text>
                  <Text fontSize="$3" color="$gray10" textAlign="center">
                    Complete a workout to set your first PR!
                  </Text>
                </YStack>
              </Card>
            )}

            {/* Description */}
            {exercise.description && (
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$2">
                  <XStack ai="center" gap="$2">
                    <BookOpen size={18} color="#7c3aed" />
                    <Text fontSize="$4" fontWeight="bold" color="$gray12">
                      Description
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$gray11" lineHeight="$4">
                    {exercise.description}
                  </Text>
                </YStack>
              </Card>
            )}

            {/* Form Notes */}
            {exercise.form_notes && (
              <Card elevate size="$4" p="$4" backgroundColor="#fef3c7">
                <YStack gap="$2">
                  <Text fontSize="$4" fontWeight="bold" color="#92400e">
                    Form Notes
                  </Text>
                  <Text fontSize="$3" color="#78350f" lineHeight="$4">
                    {exercise.form_notes}
                  </Text>
                </YStack>
              </Card>
            )}

            {/* PR History Section */}
            <YStack gap="$3">
              <XStack ai="center" gap="$2">
                <TrendingUp size={20} color="#7c3aed" />
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  PR History
                </Text>
              </XStack>

              {prHistory.length > 0 ? (
                <YStack gap="$3">
                  {prHistory.map((pr, index) => (
                    <Card
                      key={pr.id}
                      elevate
                      size="$4"
                      p="$4"
                      backgroundColor={index === 0 ? '#faf5ff' : 'white'}
                      borderWidth={index === 0 ? 2 : 0}
                      borderColor={index === 0 ? '#7c3aed' : 'transparent'}
                    >
                      <XStack ai="center" jc="space-between">
                        <YStack gap="$1">
                          <XStack ai="center" gap="$2">
                            <Text fontSize="$6" fontWeight="bold" color="#7c3aed">
                              {pr.weight_lbs} lbs
                            </Text>
                            {index === 0 && (
                              <XStack
                                backgroundColor="#dcfce7"
                                px="$2"
                                py="$1"
                                borderRadius="$2"
                              >
                                <Text fontSize="$1" fontWeight="600" color="#16a34a">
                                  CURRENT
                                </Text>
                              </XStack>
                            )}
                          </XStack>
                          <Text fontSize="$3" color="$gray10">
                            {pr.reps} rep{pr.reps > 1 ? 's' : ''} • {formatDate(pr.achieved_at)}
                          </Text>
                          {pr.notes && (
                            <Text fontSize="$3" color="$gray11" fontStyle="italic" mt="$1">
                              "{pr.notes}"
                            </Text>
                          )}
                        </YStack>
                        <TrendingUp size={24} color={index === 0 ? '#7c3aed' : '#9ca3af'} />
                      </XStack>
                    </Card>
                  ))}
                </YStack>
              ) : (
                <Card elevate size="$4" p="$4" backgroundColor="white">
                  <YStack gap="$2" ai="center" py="$3">
                    <Text fontSize="$4" color="$gray11" textAlign="center">
                      No PR history yet
                    </Text>
                    <Text fontSize="$3" color="$gray10" textAlign="center">
                      Your personal records will appear here once you complete workouts
                    </Text>
                  </YStack>
                </Card>
              )}
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}