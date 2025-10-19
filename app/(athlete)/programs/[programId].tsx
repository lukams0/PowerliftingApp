import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Progress, Text, XStack, YStack } from 'tamagui';

// Mock program data
const mockProgram = {
  id: '1',
  name: 'Strength Building Phase',
  coach: 'Coach Mike',
  description: 'A 12-week program focused on building maximum strength in the big three lifts. Progressive overload with intelligent deload weeks.',
  totalWeeks: 12,
  currentWeek: 3,
  startDate: 'Sep 1, 2024',
  blocks: [
    {
      id: 'block-1',
      name: 'Foundation Block',
      weeks: '1-4',
      weekCount: 4,
      currentWeek: 3,
      status: 'active',
      focus: 'Building base strength and technique',
      workoutsPerWeek: 4,
    },
    {
      id: 'block-2',
      name: 'Intensity Block',
      weeks: '5-8',
      weekCount: 4,
      currentWeek: 0,
      status: 'upcoming',
      focus: 'Increasing intensity and volume',
      workoutsPerWeek: 4,
    },
    {
      id: 'block-3',
      name: 'Peak Block',
      weeks: '9-11',
      weekCount: 3,
      currentWeek: 0,
      status: 'upcoming',
      focus: 'Peaking for max strength',
      workoutsPerWeek: 4,
    },
    {
      id: 'block-4',
      name: 'Test Week',
      weeks: '12',
      weekCount: 1,
      currentWeek: 0,
      status: 'upcoming',
      focus: 'Testing new maxes',
      workoutsPerWeek: 3,
    },
  ],
};

export default function ProgramDetailPage() {
  const { programId } = useLocalSearchParams();
  
  // TODO: Fetch program data based on programId
  const program = mockProgram;
  const progressPercentage = (program.currentWeek / program.totalWeeks) * 100;

  const handleBack = () => {
    router.back();
  };

  const handleBlockPress = (blockId: string) => {
    router.push(`/(athlete)/programs/block/${blockId}`);
  };

  const getBlockStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: '#dcfce7', text: '#16a34a', label: 'IN PROGRESS' };
      case 'completed':
        return { bg: '#dbeafe', text: '#2563eb', label: 'COMPLETED' };
      case 'upcoming':
        return { bg: '#f3f4f6', text: '#6b7280', label: 'UPCOMING' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280', label: 'UPCOMING' };
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
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
          <YStack f={1}>
            <Text fontSize="$7" fontWeight="bold" color="$gray12">
              {program.name}
            </Text>
            <Text fontSize="$3" color="$gray10">
              by {program.coach}
            </Text>
          </YStack>
        </XStack>

        <ScrollView>
          <YStack p="$4" gap="$4">
            {/* Progress Card */}
            <Card elevate size="$4" p="$4" backgroundColor="#7c3aed">
              <YStack gap="$3">
                <XStack ai="center" jc="space-between">
                  <Text fontSize="$3" color="white" fontWeight="600">
                    PROGRAM PROGRESS
                  </Text>
                  <Text fontSize="$5" fontWeight="bold" color="white">
                    {Math.round(progressPercentage)}%
                  </Text>
                </XStack>
                <Progress value={progressPercentage} max={100}>
                  <Progress.Indicator animation="bouncy" backgroundColor="white" />
                </Progress>
                <XStack ai="center" jc="space-between">
                  <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                    Week {program.currentWeek} of {program.totalWeeks}
                  </Text>
                  <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                    Started {program.startDate}
                  </Text>
                </XStack>
              </YStack>
            </Card>

            {/* Stats Grid */}
            <XStack gap="$3">
              <Card elevate f={1} p="$3" backgroundColor="white">
                <YStack gap="$1" ai="center">
                  <Calendar size={20} color="#7c3aed" />
                  <Text fontSize="$6" fontWeight="bold" color="$gray12">
                    {program.totalWeeks}
                  </Text>
                  <Text fontSize="$2" color="$gray10" textAlign="center">
                    Weeks
                  </Text>
                </YStack>
              </Card>
              <Card elevate f={1} p="$3" backgroundColor="white">
                <YStack gap="$1" ai="center">
                  <TrendingUp size={20} color="#7c3aed" />
                  <Text fontSize="$6" fontWeight="bold" color="$gray12">
                    {program.blocks.length}
                  </Text>
                  <Text fontSize="$2" color="$gray10" textAlign="center">
                    Blocks
                  </Text>
                </YStack>
              </Card>
              <Card elevate f={1} p="$3" backgroundColor="white">
                <YStack gap="$1" ai="center">
                  <Clock size={20} color="#7c3aed" />
                  <Text fontSize="$6" fontWeight="bold" color="$gray12">
                    4-5
                  </Text>
                  <Text fontSize="$2" color="$gray10" textAlign="center">
                    Days/Week
                  </Text>
                </YStack>
              </Card>
            </XStack>

            {/* Description */}
            <Card elevate size="$4" p="$4" backgroundColor="white">
              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="bold" color="$gray12">
                  About This Program
                </Text>
                <Text fontSize="$3" color="$gray11" lineHeight="$4">
                  {program.description}
                </Text>
              </YStack>
            </Card>

            {/* Blocks Section */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Training Blocks
              </Text>

              {program.blocks.map((block) => {
                const statusColors = getBlockStatusColor(block.status);
                return (
                  <Card
                    key={block.id}
                    elevate
                    size="$4"
                    p="$4"
                    backgroundColor={block.status === 'active' ? '#faf5ff' : 'white'}
                    borderWidth={block.status === 'active' ? 2 : 0}
                    borderColor={block.status === 'active' ? '#7c3aed' : 'transparent'}
                    pressStyle={{ opacity: 0.7, scale: 0.98 }}
                    onPress={() => handleBlockPress(block.id)}
                  >
                    <YStack gap="$3">
                      <XStack ai="center" jc="space-between">
                        <YStack gap="$1" f={1}>
                          <XStack ai="center" gap="$2">
                            <Text fontSize="$5" fontWeight="bold" color="$gray12">
                              {block.name}
                            </Text>
                            {block.status === 'active' && (
                              <XStack
                                backgroundColor={statusColors.bg}
                                px="$2"
                                py="$1"
                                borderRadius="$2"
                              >
                                <Text fontSize="$1" fontWeight="600" color={statusColors.text}>
                                  {statusColors.label}
                                </Text>
                              </XStack>
                            )}
                          </XStack>
                          <Text fontSize="$3" color="$gray10">
                            Weeks {block.weeks} • {block.weekCount} week{block.weekCount > 1 ? 's' : ''}
                          </Text>
                        </YStack>
                        {block.status === 'completed' && (
                          <CheckCircle size={24} color="#16a34a" />
                        )}
                      </XStack>

                      {block.status === 'active' && block.currentWeek > 0 && (
                        <YStack gap="$1">
                          <XStack ai="center" jc="space-between">
                            <Text fontSize="$2" color="$gray10">
                              Week {block.currentWeek} of {block.weekCount}
                            </Text>
                            <Text fontSize="$2" color="#7c3aed" fontWeight="600">
                              {Math.round((block.currentWeek / block.weekCount) * 100)}%
                            </Text>
                          </XStack>
                          <Progress value={(block.currentWeek / block.weekCount) * 100} max={100} size="$2">
                            <Progress.Indicator animation="bouncy" backgroundColor="#7c3aed" />
                          </Progress>
                        </YStack>
                      )}

                      <YStack gap="$1">
                        <Text fontSize="$3" color="$gray11">
                          {block.focus}
                        </Text>
                        <Text fontSize="$2" color="$gray10">
                          {block.workoutsPerWeek} workouts per week
                        </Text>
                      </YStack>
                    </YStack>
                  </Card>
                );
              })}
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}