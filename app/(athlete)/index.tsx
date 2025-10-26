import { router } from 'expo-router';
import { Calendar, Dumbbell, Play } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Spinner, Text, XStack, YStack } from 'tamagui';
import { ActiveWorkoutBar } from '../../components/ActiveWorkoutBar';
import { useAuth } from '../../contexts/AuthContext';
import { programService } from '../../services/program.service';
import { workoutSessionService } from '../../services/workoutsession.service';
import { Workout } from '../../types/database.types';

export default function AthleteHomeScreen() {
  const { user } = useAuth();
  const [activeProgram, setActiveProgram] = useState<any>(null);
  const [todayWorkouts, setTodayWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock active workout data - replace with actual context
  const isWorkoutActive = false;
  const activeWorkout = {
    name: 'Upper Body A',
    startTime: Date.now() - 600000,
    exercises: [{ id: '1' }, { id: '2' }]
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load athlete stats
      const statsData = await workoutSessionService.getAthleteStats(user.id);
      setStats(statsData);
      
      // Get active program
      const program = await programService.getActiveProgram(user.id);
      setActiveProgram(program);
      
      if (program) {
        // Get workouts for current week
        const workouts = await programService.getWeekWorkouts(
          program.program_id,
          program.current_week
        );
        
        // Filter for today's workouts
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const todaysWorkouts = workouts.filter(w => 
          w.day_of_week?.toLowerCase() === today.toLowerCase()
        );
        
        setTodayWorkouts(todaysWorkouts);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStartWorkout = async (workout: Workout) => {
    if (!user) return;
    
    try {
      const session = await workoutSessionService.createSession(user.id, {
        name: workout.name,
        workout_template_id: workout.id,
        notes: ''
      });
      
      router.push(`/(athlete)/programs/workout/${session.id}`);
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const handleStartCustomWorkout = async () => {
    if (!user) return;
    
    try {
      const session = await workoutSessionService.createSession(user.id, {
        name: 'Custom Workout',
        notes: ''
      });
      
      router.push(`/(athlete)/programs/workout/${session.id}`);
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray10" mt="$3">
            Loading your workout plan...
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
            <YStack gap="$2">
              <Text fontSize="$8" fontWeight="bold" color="$gray12">
                Welcome Back
              </Text>
              <Text fontSize="$4" color="$gray10">
                Ready to crush your workout?
              </Text>
            </YStack>

            {/* Stats Card */}
            {stats && (
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <XStack gap="$4" jc="space-around">
                  <YStack ai="center" gap="$1">
                    <Text fontSize="$7" fontWeight="bold" color="#7c3aed">
                      {stats.thisWeekWorkouts}
                    </Text>
                    <Text fontSize="$2" color="$gray10">This Week</Text>
                  </YStack>
                  <YStack ai="center" gap="$1">
                    <Text fontSize="$7" fontWeight="bold" color="#7c3aed">
                      {stats.totalWorkouts}
                    </Text>
                    <Text fontSize="$2" color="$gray10">Total</Text>
                  </YStack>
                  <YStack ai="center" gap="$1">
                    <Text fontSize="$7" fontWeight="bold" color="#7c3aed">
                      {Math.round(stats.averageDuration)}
                    </Text>
                    <Text fontSize="$2" color="$gray10">Avg Min</Text>
                  </YStack>
                </XStack>
              </Card>
            )}

            {/* Active Program */}
            {activeProgram && (
              <Card elevate size="$4" p="$4" backgroundColor="#faf5ff">
                <YStack gap="$3">
                  <XStack ai="center" jc="space-between">
                    <YStack gap="$1">
                      <Text fontSize="$2" color="#7c3aed" fontWeight="600">
                        ACTIVE PROGRAM
                      </Text>
                      <Text fontSize="$6" fontWeight="bold" color="$gray12">
                        {activeProgram.program.name}
                      </Text>
                      <Text fontSize="$3" color="$gray10">
                        Week {activeProgram.current_week} of {activeProgram.program.duration_weeks}
                      </Text>
                    </YStack>
                  </XStack>
                  <Button
                    size="$3"
                    chromeless
                    color="#7c3aed"
                    onPress={() => router.push(`/(athlete)/programs/${activeProgram.program_id}`)}
                  >
                    View Program
                  </Button>
                </YStack>
              </Card>
            )}

            {/* Today's Workouts */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Today's Workouts
              </Text>

              {todayWorkouts.length === 0 ? (
                <Card elevate size="$4" p="$5" backgroundColor="white">
                  <YStack ai="center" gap="$3">
                    <Calendar size={40} color="#d1d5db" />
                    <YStack ai="center" gap="$1">
                      <Text fontSize="$4" fontWeight="600" color="$gray12" textAlign="center">
                        No Scheduled Workouts
                      </Text>
                      <Text fontSize="$3" color="$gray10" textAlign="center">
                        Start a custom workout or check your program schedule
                      </Text>
                    </YStack>
                    <Button
                      size="$4"
                      backgroundColor="#7c3aed"
                      color="white"
                      icon={Play}
                      onPress={handleStartCustomWorkout}
                    >
                      Start Custom Workout
                    </Button>
                  </YStack>
                </Card>
              ) : (
                todayWorkouts.map((workout) => (
                  <Card
                    key={workout.id}
                    elevate
                    size="$4"
                    p="$4"
                    backgroundColor="white"
                  >
                    <YStack gap="$3">
                      <YStack gap="$2">
                        <Text fontSize="$6" fontWeight="bold" color="$gray12">
                          {workout.name}
                        </Text>
                        {workout.description && (
                          <Text fontSize="$3" color="$gray10">
                            {workout.description}
                          </Text>
                        )}
                        {workout.estimated_duration_minutes && (
                          <XStack ai="center" gap="$2">
                            <Dumbbell size={16} color="#6b7280" />
                            <Text fontSize="$3" color="$gray10">
                              Estimated {workout.estimated_duration_minutes} minutes
                            </Text>
                          </XStack>
                        )}
                      </YStack>
                      <Button
                        size="$4"
                        backgroundColor="#7c3aed"
                        color="white"
                        icon={Play}
                        onPress={() => handleStartWorkout(workout)}
                      >
                        Start Workout
                      </Button>
                    </YStack>
                  </Card>
                ))
              )}
            </YStack>

            {/* Quick Start */}
            <Card elevate size="$4" p="$4" backgroundColor="white">
              <YStack gap="$3">
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Quick Start
                </Text>
                <Button
                  size="$4"
                  backgroundColor="white"
                  borderColor="#e5e7eb"
                  borderWidth={1}
                  color="$gray12"
                  icon={Play}
                  onPress={handleStartCustomWorkout}
                >
                  Start Custom Workout
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