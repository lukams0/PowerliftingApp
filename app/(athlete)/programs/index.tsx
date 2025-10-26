import { router } from 'expo-router';
import { BookOpen, Plus } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Progress, Text, XStack, YStack } from 'tamagui';
import { ActiveWorkoutBar } from '../../../components/ActiveWorkoutBar';

const mockPrograms = [
  {
    id: '1',
    name: 'Strength Building Phase',
    coach: 'Coach Mike',
    weeks: 12,
    currentWeek: 3,
    isActive: true,
  },
  {
    id: '2',
    name: 'Hypertrophy Block',
    coach: 'Coach Sarah',
    weeks: 8,
    currentWeek: 8,
    isActive: false,
  },
];

export default function ProgramsIndexScreen() {
  const handleProgramPress = (programId: string) => {
    router.push(`/(athlete)/programs/${programId}`);
  };

  // Mock active workout data - in real app, get from context: const { activeWorkout, isWorkoutActive } = useWorkout();
  const isWorkoutActive = false;
  const activeWorkout = {
    name: 'Upper Body A',
    startTime: Date.now() - 600000,
    exercises: [{ id: '1' }, { id: '2' }]
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        <ScrollView>
          <YStack p="$4" gap="$4">
            {/* Header */}
            <XStack ai="center" jc="space-between">
              <Text fontSize="$8" fontWeight="bold" color="$gray12">
                Programs
              </Text>
              <Button
                size="$3"
                chromeless
                color="#7c3aed"
                fontWeight="600"
                onPress={() => console.log('Browse programs')}
              >
                <XStack ai="center" gap="$1">
                  <Plus size={20} color="#7c3aed" />
                  <Text color="#7c3aed" fontWeight="600">Browse</Text>
                </XStack>
              </Button>
            </XStack>

            {/* Active Program */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Active Program
              </Text>
              <Card 
                elevate 
                size="$4" 
                p="$5" 
                backgroundColor="white"
                pressStyle={{ opacity: 0.7, scale: 0.98 }}
                onPress={() => handleProgramPress('1')}
              >
                <YStack gap="$4">
                  <XStack ai="center" jc="space-between">
                    <YStack gap="$2">
                      <XStack
                        backgroundColor="#dcfce7"
                        px="$2"
                        py="$1"
                        borderRadius="$2"
                        alignSelf="flex-start"
                      >
                        <Text fontSize="$1" fontWeight="600" color="#16a34a">
                          ACTIVE
                        </Text>
                      </XStack>
                      <Text fontSize="$6" fontWeight="bold" color="$gray12">
                        Strength Building Phase
                      </Text>
                      <Text fontSize="$3" color="$gray10">
                        by Coach Mike
                      </Text>
                    </YStack>
                  </XStack>

                  <YStack gap="$2">
                    <XStack ai="center" jc="space-between">
                      <Text fontSize="$3" color="$gray11">
                        Week 3 of 12
                      </Text>
                      <Text fontSize="$3" color="#7c3aed" fontWeight="600">
                        25%
                      </Text>
                    </XStack>
                    <Progress value={25} max={100}>
                      <Progress.Indicator animation="bouncy" backgroundColor="#7c3aed" />
                    </Progress>
                  </YStack>

                  <Button
                    size="$4"
                    backgroundColor="#7c3aed"
                    color="white"
                    onPress={() => handleProgramPress('1')}
                    pressStyle={{ backgroundColor: '#6d28d9' }}
                  >
                    View Program
                  </Button>
                </YStack>
              </Card>
            </YStack>

            {/* Past Programs */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Past Programs
              </Text>
              <Card
                elevate
                size="$4"
                p="$4"
                backgroundColor="white"
                pressStyle={{ opacity: 0.7, scale: 0.98 }}
                onPress={() => handleProgramPress('2')}
              >
                <YStack gap="$2">
                  <XStack ai="center" jc="space-between">
                    <Text fontSize="$5" fontWeight="bold" color="$gray12">
                      Hypertrophy Block
                    </Text>
                    <XStack
                      backgroundColor="#dbeafe"
                      px="$2"
                      py="$1"
                      borderRadius="$2"
                    >
                      <Text fontSize="$1" fontWeight="600" color="#2563eb">
                        COMPLETED
                      </Text>
                    </XStack>
                  </XStack>
                  <Text fontSize="$3" color="$gray10">
                    by Coach Sarah • 8 weeks
                  </Text>
                </YStack>
              </Card>
            </YStack>

            {/* Discover Programs */}
            <Card elevate size="$4" p="$5" backgroundColor="#faf5ff">
              <YStack ai="center" gap="$3">
                <BookOpen size={40} color="#7c3aed" />
                <YStack ai="center" gap="$1">
                  <Text fontSize="$5" fontWeight="bold" color="$gray12" textAlign="center">
                    Discover New Programs
                  </Text>
                  <Text fontSize="$3" color="$gray10" textAlign="center">
                    Browse programs from top coaches
                  </Text>
                </YStack>
                <Button
                  size="$4"
                  backgroundColor="#7c3aed"
                  color="white"
                  onPress={() => console.log('Browse programs')}
                  pressStyle={{ backgroundColor: '#6d28d9' }}
                >
                  Browse Programs
                </Button>
              </YStack>
            </Card>
          </YStack>
        </ScrollView>

        {/* Active Workout Bar */}
        {isWorkoutActive && (
          <YStack 
            position="absolute" 
            bottom={Platform.OS === 'ios' ? 88 : 60} 
            left={0} 
            right={0}
            pointerEvents="box-none"
          >
            <ActiveWorkoutBar
              workoutName={activeWorkout.name}
              startTime={activeWorkout.startTime}
              exerciseCount={activeWorkout.exercises.length}
            />
          </YStack>
        )}
      </YStack>
    </SafeAreaView>
  );
}