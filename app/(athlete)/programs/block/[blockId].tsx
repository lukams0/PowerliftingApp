import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle, Clock, Dumbbell } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Progress, Text, XStack, YStack } from 'tamagui';

// Mock block data
const mockBlock = {
  id: 'block-1',
  name: 'Foundation Block',
  programName: 'Strength Building Phase',
  weeks: '1-4',
  weekCount: 4,
  currentWeek: 3,
  focus: 'Building base strength and technique',
  description: 'This block focuses on building a strong foundation with moderate intensity and volume. Perfect your technique on the main lifts while building work capacity.',
  weeks_data: [
    {
      weekNumber: 1,
      weekLabel: 'Week 1',
      status: 'completed',
      workouts: [
        { id: 'w1-1', day: 'Monday', name: 'Upper Body A', exercises: 6, duration: '60 min', completed: true },
        { id: 'w1-2', day: 'Tuesday', name: 'Lower Body A', exercises: 5, duration: '55 min', completed: true },
        { id: 'w1-3', day: 'Thursday', name: 'Upper Body B', exercises: 6, duration: '60 min', completed: true },
        { id: 'w1-4', day: 'Friday', name: 'Lower Body B', exercises: 5, duration: '55 min', completed: true },
      ],
    },
    {
      weekNumber: 2,
      weekLabel: 'Week 2',
      status: 'completed',
      workouts: [
        { id: 'w2-1', day: 'Monday', name: 'Upper Body A', exercises: 6, duration: '60 min', completed: true },
        { id: 'w2-2', day: 'Tuesday', name: 'Lower Body A', exercises: 5, duration: '55 min', completed: true },
        { id: 'w2-3', day: 'Thursday', name: 'Upper Body B', exercises: 6, duration: '60 min', completed: true },
        { id: 'w2-4', day: 'Friday', name: 'Lower Body B', exercises: 5, duration: '55 min', completed: true },
      ],
    },
    {
      weekNumber: 3,
      weekLabel: 'Week 3',
      status: 'active',
      workouts: [
        { id: 'w3-1', day: 'Monday', name: 'Upper Body A', exercises: 6, duration: '60 min', completed: true },
        { id: 'w3-2', day: 'Tuesday', name: 'Lower Body A', exercises: 5, duration: '55 min', completed: true },
        { id: 'w3-3', day: 'Thursday', name: 'Upper Body B', exercises: 6, duration: '60 min', completed: false },
        { id: 'w3-4', day: 'Friday', name: 'Lower Body B', exercises: 5, duration: '55 min', completed: false },
      ],
    },
    {
      weekNumber: 4,
      weekLabel: 'Week 4 - Deload',
      status: 'upcoming',
      workouts: [
        { id: 'w4-1', day: 'Monday', name: 'Upper Body A', exercises: 5, duration: '45 min', completed: false },
        { id: 'w4-2', day: 'Tuesday', name: 'Lower Body A', exercises: 4, duration: '40 min', completed: false },
        { id: 'w4-3', day: 'Thursday', name: 'Upper Body B', exercises: 5, duration: '45 min', completed: false },
        { id: 'w4-4', day: 'Friday', name: 'Lower Body B', exercises: 4, duration: '40 min', completed: false },
      ],
    },
  ],
};

export default function BlockDetailPage() {
  const { blockId } = useLocalSearchParams();
  
  // TODO: Fetch block data based on blockId
  const block = mockBlock;

  const handleBack = () => {
    router.back();
  };

  const handleWorkoutPress = (workoutId: string) => {
    router.push(`/(athlete)/programs/workout/${workoutId}`);
  };

  const getWeekStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: '#dcfce7', text: '#16a34a', label: 'CURRENT WEEK' };
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
              {block.name}
            </Text>
            <Text fontSize="$3" color="$gray10">
              {block.programName} • Weeks {block.weeks}
            </Text>
          </YStack>
        </XStack>

        <ScrollView>
          <YStack p="$4" gap="$4">
            {/* Progress Card */}
            <Card elevate size="$4" p="$4" backgroundColor="#7c3aed">
              <YStack gap="$3">
                <Text fontSize="$3" color="white" fontWeight="600">
                  BLOCK PROGRESS
                </Text>
                <XStack ai="flex-end" gap="$2">
                  <Text fontSize="$8" fontWeight="bold" color="white">
                    Week {block.currentWeek}
                  </Text>
                  <Text fontSize="$4" color="rgba(255,255,255,0.9)" mb="$1">
                    of {block.weekCount}
                  </Text>
                </XStack>
                <Progress value={(block.currentWeek / block.weekCount) * 100} max={100}>
                  <Progress.Indicator animation="bouncy" backgroundColor="white" />
                </Progress>
              </YStack>
            </Card>

            {/* Description */}
            <Card elevate size="$4" p="$4" backgroundColor="white">
              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="bold" color="$gray12">
                  Block Focus
                </Text>
                <Text fontSize="$3" color="$gray11" lineHeight="$4">
                  {block.description}
                </Text>
              </YStack>
            </Card>

            {/* Weeks */}
            <YStack gap="$4">
              {block.weeks_data.map((week) => {
                const statusColors = getWeekStatusColor(week.status);
                const completedWorkouts = week.workouts.filter(w => w.completed).length;
                
                return (
                  <YStack key={week.weekNumber} gap="$3">
                    <XStack ai="center" jc="space-between">
                      <XStack ai="center" gap="$2">
                        <Text fontSize="$5" fontWeight="bold" color="$gray12">
                          {week.weekLabel}
                        </Text>
                        {week.status === 'active' && (
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
                        {completedWorkouts}/{week.workouts.length} completed
                      </Text>
                    </XStack>

                    {/* Workouts for this week */}
                    <YStack gap="$2">
                      {week.workouts.map((workout) => (
                        <Card
                          key={workout.id}
                          elevate
                          size="$4"
                          p="$4"
                          backgroundColor={workout.completed ? '#f0fdf4' : 'white'}
                          borderWidth={workout.completed ? 1 : 0}
                          borderColor={workout.completed ? '#86efac' : 'transparent'}
                          pressStyle={{ opacity: 0.7, scale: 0.98 }}
                          onPress={() => handleWorkoutPress(workout.id)}
                        >
                          <XStack ai="center" jc="space-between">
                            <YStack gap="$2" f={1}>
                              <XStack ai="center" gap="$2">
                                <XStack
                                  backgroundColor="#faf5ff"
                                  px="$2"
                                  py="$1"
                                  borderRadius="$2"
                                >
                                  <Text fontSize="$1" fontWeight="600" color="#7c3aed">
                                    {workout.day.toUpperCase()}
                                  </Text>
                                </XStack>
                                {workout.completed && (
                                  <CheckCircle size={16} color="#16a34a" />
                                )}
                              </XStack>
                              <Text fontSize="$4" fontWeight="bold" color="$gray12">
                                {workout.name}
                              </Text>
                              <XStack ai="center" gap="$3">
                                <XStack ai="center" gap="$1">
                                  <Dumbbell size={14} color="#9ca3af" />
                                  <Text fontSize="$2" color="$gray10">
                                    {workout.exercises} exercises
                                  </Text>
                                </XStack>
                                <Text fontSize="$2" color="$gray9">•</Text>
                                <XStack ai="center" gap="$1">
                                  <Clock size={14} color="#9ca3af" />
                                  <Text fontSize="$2" color="$gray10">
                                    {workout.duration}
                                  </Text>
                                </XStack>
                              </XStack>
                            </YStack>
                          </XStack>
                        </Card>
                      ))}
                    </YStack>
                  </YStack>
                );
              })}
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}