import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, BookOpen, Calendar, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Tabs, Text, XStack, YStack } from 'tamagui';

// Mock exercise data - replace with actual data from API/database
const mockExerciseData = {
  id: '1',
  name: 'Squat',
  category: 'Legs',
  description: 'A compound lower body exercise targeting quads, glutes, and hamstrings.',
  currentPR: '315 lbs',
  prDate: 'Oct 10, 2024',
  lastPerformed: '2 days ago',
  totalSets: 156,
  totalReps: 1248,
  avgWeight: '275 lbs',
  notes: 'Focus on depth and keeping chest up. Pause at bottom for better control.',
};

// Mock history data
const mockHistory = [
  { id: '1', date: 'Oct 16', sets: 4, reps: '5, 5, 4, 3', weight: '295 lbs', notes: 'Felt strong' },
  { id: '2', date: 'Oct 12', sets: 4, reps: '5, 5, 5, 4', weight: '285 lbs', notes: 'Good depth' },
  { id: '3', date: 'Oct 9', sets: 5, reps: '5, 5, 5, 5, 5', weight: '275 lbs', notes: '' },
  { id: '4', date: 'Oct 5', sets: 4, reps: '6, 6, 5, 5', weight: '265 lbs', notes: 'Deload week' },
];

// Mock PR history
const mockPRHistory = [
  { id: '1', weight: '315 lbs', reps: 1, date: 'Oct 10, 2024' },
  { id: '2', weight: '305 lbs', reps: 1, date: 'Sep 15, 2024' },
  { id: '3', weight: '295 lbs', reps: 1, date: 'Aug 20, 2024' },
  { id: '4', weight: '285 lbs', reps: 1, date: 'Jul 10, 2024' },
];

export default function ExerciseDetailPage() {
  const { exerciseId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('history');

  // TODO: Fetch exercise data based on exerciseId
  const exercise = mockExerciseData;

  const handleBack = () => {
    router.back();
  };

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
              {exercise.category}
            </Text>
          </YStack>
        </XStack>

        <ScrollView>
          <YStack p="$4" gap="$4">
            {/* PR Card */}
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
                    {exercise.currentPR}
                  </Text>
                </XStack>
                <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                  Set on {exercise.prDate}
                </Text>
              </YStack>
            </Card>

            {/* Stats Grid */}
            <XStack gap="$3">
              <Card elevate f={1} p="$4" backgroundColor="white">
                <YStack gap="$2" ai="center">
                  <Text fontSize="$6" fontWeight="bold" color="#7c3aed">
                    {exercise.totalSets}
                  </Text>
                  <Text fontSize="$2" color="$gray10" textAlign="center">
                    Total Sets
                  </Text>
                </YStack>
              </Card>
              <Card elevate f={1} p="$4" backgroundColor="white">
                <YStack gap="$2" ai="center">
                  <Text fontSize="$6" fontWeight="bold" color="#7c3aed">
                    {exercise.totalReps}
                  </Text>
                  <Text fontSize="$2" color="$gray10" textAlign="center">
                    Total Reps
                  </Text>
                </YStack>
              </Card>
              <Card elevate f={1} p="$4" backgroundColor="white">
                <YStack gap="$2" ai="center">
                  <Text fontSize="$6" fontWeight="bold" color="#7c3aed">
                    {exercise.avgWeight}
                  </Text>
                  <Text fontSize="$2" color="$gray10" textAlign="center">
                    Avg Weight
                  </Text>
                </YStack>
              </Card>
            </XStack>

            {/* Description */}
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

            {/* Notes */}
            {exercise.notes && (
              <Card elevate size="$4" p="$4" backgroundColor="#fef3c7">
                <YStack gap="$2">
                  <Text fontSize="$4" fontWeight="bold" color="#92400e">
                    Form Notes
                  </Text>
                  <Text fontSize="$3" color="#78350f" lineHeight="$4">
                    {exercise.notes}
                  </Text>
                </YStack>
              </Card>
            )}

            {/* Tabs for History & PRs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              flexDirection="column"
              gap="$3"
            >
              <Tabs.List
                backgroundColor="white"
                borderRadius="$4"
                padding="$1"
                gap="$2"
              >
                <Tabs.Tab
                  f={1}
                  value="history"
                  backgroundColor={activeTab === 'history' ? '#7c3aed' : 'transparent'}
                  borderRadius="$3"
                  pressStyle={{ opacity: 0.8 }}
                >
                  <XStack ai="center" gap="$2">
                    <Calendar size={16} color={activeTab === 'history' ? 'white' : '#6b7280'} />
                    <Text
                      fontSize="$4"
                      fontWeight="600"
                      color={activeTab === 'history' ? 'white' : '$gray11'}
                    >
                      History
                    </Text>
                  </XStack>
                </Tabs.Tab>
                <Tabs.Tab
                  f={1}
                  value="prs"
                  backgroundColor={activeTab === 'prs' ? '#7c3aed' : 'transparent'}
                  borderRadius="$3"
                  pressStyle={{ opacity: 0.8 }}
                >
                  <XStack ai="center" gap="$2">
                    <TrendingUp size={16} color={activeTab === 'prs' ? 'white' : '#6b7280'} />
                    <Text
                      fontSize="$4"
                      fontWeight="600"
                      color={activeTab === 'prs' ? 'white' : '$gray11'}
                    >
                      PRs
                    </Text>
                  </XStack>
                </Tabs.Tab>
              </Tabs.List>

              {/* History Tab Content */}
              {activeTab === 'history' && (
                <YStack gap="$3">
                  {mockHistory.map((session) => (
                    <Card
                      key={session.id}
                      elevate
                      size="$4"
                      p="$4"
                      backgroundColor="white"
                    >
                      <YStack gap="$3">
                        <XStack ai="center" jc="space-between">
                          <YStack gap="$1">
                            <Text fontSize="$4" fontWeight="bold" color="$gray12">
                              {session.date}
                            </Text>
                            <Text fontSize="$3" color="$gray10">
                              {session.sets} sets • {session.weight}
                            </Text>
                          </YStack>
                        </XStack>
                        <YStack gap="$1">
                          <Text fontSize="$3" color="$gray11">
                            Reps: {session.reps}
                          </Text>
                          {session.notes && (
                            <Text fontSize="$3" color="$gray10" fontStyle="italic">
                              "{session.notes}"
                            </Text>
                          )}
                        </YStack>
                      </YStack>
                    </Card>
                  ))}
                </YStack>
              )}

              {/* PRs Tab Content */}
              {activeTab === 'prs' && (
                <YStack gap="$3">
                  {mockPRHistory.map((pr, index) => (
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
                              {pr.weight}
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
                            {pr.reps} rep{pr.reps > 1 ? 's' : ''} • {pr.date}
                          </Text>
                        </YStack>
                        <TrendingUp size={24} color={index === 0 ? '#7c3aed' : '#9ca3af'} />
                      </XStack>
                    </Card>
                  ))}
                </YStack>
              )}
            </Tabs>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}