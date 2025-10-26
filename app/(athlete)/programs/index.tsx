import { router } from 'expo-router';
import { BookOpen, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Progress, Spinner, Text, XStack, YStack } from 'tamagui';
import { ActiveWorkoutBar } from '../../../components/ActiveWorkoutBar';
import { useAuth } from '../../../contexts/AuthContext';
import { programService } from '../../../services/program.service';

export default function ProgramsIndexScreen() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock active workout data
  const isWorkoutActive = false;
  const activeWorkout = {
    name: 'Upper Body A',
    startTime: Date.now() - 600000,
    exercises: [{ id: '1' }, { id: '2' }]
  };

  useEffect(() => {
    loadPrograms();
  }, [user]);

  const loadPrograms = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await programService.getAthletePrograms(user.id);
      setPrograms(data);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrograms();
    setRefreshing(false);
  };

  const handleProgramPress = (programId: string) => {
    router.push(`/(athlete)/programs/${programId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: '#dcfce7', text: '#16a34a', label: 'ACTIVE' };
      case 'completed':
        return { bg: '#dbeafe', text: '#2563eb', label: 'COMPLETED' };
      case 'paused':
        return { bg: '#fef3c7', text: '#d97706', label: 'PAUSED' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280', label: 'UNKNOWN' };
    }
  };

  const calculateProgress = (currentWeek: number, totalWeeks: number) => {
    return Math.round((currentWeek / totalWeeks) * 100);
  };

  const activePrograms = programs.filter(p => p.status === 'active');
  const completedPrograms = programs.filter(p => p.status === 'completed');
  const pausedPrograms = programs.filter(p => p.status === 'paused');

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray10" mt="$3">
            Loading your programs...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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

            {/* Empty State */}
            {programs.length === 0 && (
              <Card elevate size="$4" p="$6" backgroundColor="white">
                <YStack ai="center" gap="$3">
                  <BookOpen size={48} color="#d1d5db" />
                  <YStack ai="center" gap="$2">
                    <Text fontSize="$5" fontWeight="bold" color="$gray12" textAlign="center">
                      No Programs Yet
                    </Text>
                    <Text fontSize="$3" color="$gray10" textAlign="center">
                      Browse and enroll in a program to get started with structured training
                    </Text>
                  </YStack>
                  <Button
                    size="$4"
                    backgroundColor="#7c3aed"
                    color="white"
                    onPress={() => console.log('Browse programs')}
                  >
                    Browse Programs
                  </Button>
                </YStack>
              </Card>
            )}

            {/* Active Programs */}
            {activePrograms.length > 0 && (
              <YStack gap="$3">
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Active Program
                </Text>
                {activePrograms.map((athleteProgram) => {
                  const program = athleteProgram.program;
                  const status = getStatusColor(athleteProgram.status);
                  const progress = calculateProgress(
                    athleteProgram.current_week,
                    program.duration_weeks
                  );

                  return (
                    <Card
                      key={athleteProgram.id}
                      elevate
                      size="$4"
                      p="$5"
                      backgroundColor="white"
                      pressStyle={{ opacity: 0.7, scale: 0.98 }}
                      onPress={() => handleProgramPress(program.id)}
                    >
                      <YStack gap="$4">
                        <XStack ai="center" jc="space-between">
                          <YStack gap="$2">
                            <XStack
                              backgroundColor={status.bg}
                              px="$2"
                              py="$1"
                              borderRadius="$2"
                              alignSelf="flex-start"
                            >
                              <Text fontSize="$1" fontWeight="600" color={status.text}>
                                {status.label}
                              </Text>
                            </XStack>
                            <Text fontSize="$6" fontWeight="bold" color="$gray12">
                              {program.name}
                            </Text>
                            {program.description && (
                              <Text fontSize="$3" color="$gray10" numberOfLines={2}>
                                {program.description}
                              </Text>
                            )}
                          </YStack>
                        </XStack>

                        <YStack gap="$2">
                          <XStack ai="center" jc="space-between">
                            <Text fontSize="$3" color="$gray11">
                              Week {athleteProgram.current_week} of {program.duration_weeks}
                            </Text>
                            <Text fontSize="$3" color="#7c3aed" fontWeight="600">
                              {progress}%
                            </Text>
                          </XStack>
                          <Progress value={progress} max={100}>
                            <Progress.Indicator animation="bouncy" backgroundColor="#7c3aed" />
                          </Progress>
                        </YStack>

                        <Button
                          size="$4"
                          backgroundColor="#7c3aed"
                          color="white"
                          onPress={() => handleProgramPress(program.id)}
                          pressStyle={{ backgroundColor: '#6d28d9' }}
                        >
                          View Program
                        </Button>
                      </YStack>
                    </Card>
                  );
                })}
              </YStack>
            )}

            {/* Paused Programs */}
            {pausedPrograms.length > 0 && (
              <YStack gap="$3">
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Paused Programs
                </Text>
                {pausedPrograms.map((athleteProgram) => {
                  const program = athleteProgram.program;
                  const status = getStatusColor(athleteProgram.status);

                  return (
                    <Card
                      key={athleteProgram.id}
                      elevate
                      size="$4"
                      p="$4"
                      backgroundColor="white"
                      pressStyle={{ opacity: 0.7, scale: 0.98 }}
                      onPress={() => handleProgramPress(program.id)}
                    >
                      <YStack gap="$2">
                        <XStack ai="center" jc="space-between">
                          <Text fontSize="$5" fontWeight="bold" color="$gray12">
                            {program.name}
                          </Text>
                          <XStack
                            backgroundColor={status.bg}
                            px="$2"
                            py="$1"
                            borderRadius="$2"
                          >
                            <Text fontSize="$1" fontWeight="600" color={status.text}>
                              {status.label}
                            </Text>
                          </XStack>
                        </XStack>
                        <Text fontSize="$3" color="$gray10">
                          Week {athleteProgram.current_week} of {program.duration_weeks}
                        </Text>
                      </YStack>
                    </Card>
                  );
                })}
              </YStack>
            )}

            {/* Completed Programs */}
            {completedPrograms.length > 0 && (
              <YStack gap="$3">
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Completed Programs
                </Text>
                {completedPrograms.map((athleteProgram) => {
                  const program = athleteProgram.program;
                  const status = getStatusColor(athleteProgram.status);

                  return (
                    <Card
                      key={athleteProgram.id}
                      elevate
                      size="$4"
                      p="$4"
                      backgroundColor="white"
                      pressStyle={{ opacity: 0.7, scale: 0.98 }}
                      onPress={() => handleProgramPress(program.id)}
                    >
                      <YStack gap="$2">
                        <XStack ai="center" jc="space-between">
                          <Text fontSize="$5" fontWeight="bold" color="$gray12">
                            {program.name}
                          </Text>
                          <XStack
                            backgroundColor={status.bg}
                            px="$2"
                            py="$1"
                            borderRadius="$2"
                          >
                            <Text fontSize="$1" fontWeight="600" color={status.text}>
                              {status.label}
                            </Text>
                          </XStack>
                        </XStack>
                        <Text fontSize="$3" color="$gray10">
                          Completed on {new Date(athleteProgram.end_date!).toLocaleDateString()}
                        </Text>
                      </YStack>
                    </Card>
                  );
                })}
              </YStack>
            )}

            {/* Discover Programs */}
            {programs.length > 0 && (
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
            )}
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