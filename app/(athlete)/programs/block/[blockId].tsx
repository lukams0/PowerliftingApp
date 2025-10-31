import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle, Clock, Dumbbell } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Progress, Spinner, Text, XStack, YStack } from 'tamagui';
import { useAuth } from '../../../../contexts/AuthContext';
import { programService } from '../../../../services/program.service';
import type { ProgramBlock, Program, Workout } from '../../../../services/program.service';

export default function BlockDetailPage() {
  const { blockId } = useLocalSearchParams();
  const { user } = useAuth();
  const [block, setBlock] = useState<(ProgramBlock & { workouts: Workout[]; program: Program }) | null>(null);
  const [athleteProgram, setAthleteProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlock();
  }, [blockId, user]);

  const loadBlock = async () => {
    if (!blockId || !user) return;

    try {
      setLoading(true);

      // Fetch block details
      const blockData = await programService.getBlockDetails(blockId as string);
      setBlock(blockData);

      if (blockData) {
        // Fetch athlete's enrollment to get current week
        const athletePrograms = await programService.getAthletePrograms(user.id);
        const enrollment = athletePrograms.find(ap => ap.program_id === blockData.program_id);
        setAthleteProgram(enrollment);
      }
    } catch (error) {
      console.error('Error loading block:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray10" mt="$3">
            Loading block...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (!block) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center" p="$4">
          <Text fontSize="$5" color="$gray11" textAlign="center">
            Block not found
          </Text>
          <Button mt="$4" onPress={() => router.back()}>
            Go Back
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }

  const currentWeek = athleteProgram?.current_week || 1;
  const weekCount = block.end_week - block.start_week + 1;
  const blockCurrentWeek = currentWeek >= block.start_week && currentWeek <= block.end_week
    ? currentWeek - block.start_week + 1
    : 0;

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

  // Group workouts by week
  const workoutsByWeek: { [weekNumber: number]: Workout[] } = {};
  block.workouts.forEach((workout) => {
    if (workout.week_number !== null) {
      if (!workoutsByWeek[workout.week_number]) {
        workoutsByWeek[workout.week_number] = [];
      }
      workoutsByWeek[workout.week_number].push(workout);
    }
  });

  // Create week data array
  const weeksData = [];
  for (let weekNum = block.start_week; weekNum <= block.end_week; weekNum++) {
    const workouts = workoutsByWeek[weekNum] || [];
    let status = 'upcoming';
    if (weekNum < currentWeek) status = 'completed';
    else if (weekNum === currentWeek) status = 'active';

    weeksData.push({
      weekNumber: weekNum,
      weekLabel: `Week ${weekNum}`,
      status,
      workouts,
    });
  }

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
              {block.program.name} • Weeks {block.start_week}-{block.end_week}
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
                    {blockCurrentWeek > 0 ? `Week ${blockCurrentWeek}` : 'Not Started'}
                  </Text>
                  {blockCurrentWeek > 0 && (
                    <Text fontSize="$4" color="rgba(255,255,255,0.9)" mb="$1">
                      of {weekCount}
                    </Text>
                  )}
                </XStack>
                {blockCurrentWeek > 0 && (
                  <Progress value={(blockCurrentWeek / weekCount) * 100} max={100}>
                    <Progress.Indicator animation="bouncy" backgroundColor="white" />
                  </Progress>
                )}
              </YStack>
            </Card>

            {/* Description */}
            {(block.description || block.focus) && (
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$2">
                  <Text fontSize="$4" fontWeight="bold" color="$gray12">
                    Block Focus
                  </Text>
                  {block.description && (
                    <Text fontSize="$3" color="$gray11" lineHeight="$4">
                      {block.description}
                    </Text>
                  )}
                  {block.focus && (
                    <Text fontSize="$3" color="$gray11" lineHeight="$4" fontStyle="italic">
                      {block.focus}
                    </Text>
                  )}
                </YStack>
              </Card>
            )}

            {/* Weeks */}
            <YStack gap="$4">
              {weeksData.map((week) => {
                const statusColors = getWeekStatusColor(week.status);
                
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
                      {week.workouts.length > 0 && (
                        <Text fontSize="$3" color="$gray10">
                          {week.workouts.length} workout{week.workouts.length !== 1 ? 's' : ''}
                        </Text>
                      )}
                    </XStack>

                    {/* Workouts for this week */}
                    <YStack gap="$2">
                      {week.workouts.length === 0 ? (
                        <Card elevate size="$4" p="$4" backgroundColor="white">
                          <Text fontSize="$3" color="$gray10" textAlign="center">
                            No workouts scheduled
                          </Text>
                        </Card>
                      ) : (
                        week.workouts.map((workout) => (
                          <Card
                            key={workout.id}
                            elevate
                            size="$4"
                            p="$4"
                            backgroundColor="white"
                            pressStyle={{ opacity: 0.7, scale: 0.98 }}
                            onPress={() => handleWorkoutPress(workout.id)}
                          >
                            <XStack ai="center" jc="space-between">
                              <YStack gap="$2" f={1}>
                                <XStack ai="center" gap="$2">
                                  {workout.day_of_week && (
                                    <XStack
                                      backgroundColor="#faf5ff"
                                      px="$2"
                                      py="$1"
                                      borderRadius="$2"
                                    >
                                      <Text fontSize="$1" fontWeight="600" color="#7c3aed">
                                        {workout.day_of_week.toUpperCase()}
                                      </Text>
                                    </XStack>
                                  )}
                                </XStack>
                                <Text fontSize="$4" fontWeight="bold" color="$gray12">
                                  {workout.name}
                                </Text>
                                {workout.description && (
                                  <Text fontSize="$2" color="$gray10" numberOfLines={1}>
                                    {workout.description}
                                  </Text>
                                )}
                                <XStack ai="center" gap="$3">
                                  {workout.estimated_duration_minutes && (
                                    <>
                                      <XStack ai="center" gap="$1">
                                        <Clock size={14} color="#9ca3af" />
                                        <Text fontSize="$2" color="$gray10">
                                          {workout.estimated_duration_minutes} min
                                        </Text>
                                      </XStack>
                                    </>
                                  )}
                                </XStack>
                              </YStack>
                            </XStack>
                          </Card>
                        ))
                      )}
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