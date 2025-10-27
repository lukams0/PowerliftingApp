import { router } from 'expo-router';
import { Calendar, Dumbbell, Play } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Spinner, Text, XStack, YStack } from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkout } from '../../contexts/WorkoutContext';
import { programService } from '../../services/program.service';
import { workoutSessionService } from '../../services/workoutsession.service';
import { Workout } from '../../types/database.types';

export default function AthleteHomeScreen() {
  const { user } = useAuth();
  const { startWorkout, loadActiveWorkout } = useWorkout();
  const [activeProgram, setActiveProgram] = useState<any>(null);
  const [todayWorkouts, setTodayWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Check for active workout
      await loadActiveWorkout(user.id);
      
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
      // Create session in database
      const session = await workoutSessionService.createSession(user.id, {
        name: workout.name,
        workout_template_id: workout.id,
        notes: ''
      });
      
      // Set active workout in context
      await startWorkout(session.id);
      
      // Open workout modal
      router.push('/workout');
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const handleStartCustomWorkout = async () => {
    if (!user) return;
    
    try {
      // Create session in database
      const session = await workoutSessionService.createSession(user.id, {
        name: 'Custom Workout',
        notes: ''
      });
      
      // Set active workout in context
      await startWorkout(session.id);
      
      // Open workout modal
      router.push('/workout');
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
                <YStack gap="$3">
                  <Text fontSize="$4" fontWeight="600" color="$gray12">
                    Your Progress
                  </Text>
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
                        {Math.round(stats.totalVolume / 1000)}k
                      </Text>
                      <Text fontSize="$2" color="$gray10">Total lbs</Text>
                    </YStack>
                  </XStack>
                </YStack>
              </Card>
            )}

            {/* Active Program */}
            {activeProgram && (
              <Card elevate size="$4" p="$4" backgroundColor="#faf5ff">
                <YStack gap="$3">
                  <XStack ai="center" gap="$2">
                    <Calendar size={20} color="#7c3aed" />
                    <Text fontSize="$4" fontWeight="600" color="#7c3aed">
                      CURRENT PROGRAM
                    </Text>
                  </XStack>
                  <Text fontSize="$6" fontWeight="bold" color="$gray12">
                    {activeProgram.program_name}
                  </Text>
                  <Text fontSize="$3" color="$gray10">
                    Week {activeProgram.current_week} of {activeProgram.total_weeks}
                  </Text>
                  <Button
                    size="$4"
                    backgroundColor="#7c3aed"
                    color="white"
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
                  <YStack ai="center" gap="$2">
                    <Dumbbell size={32} color="#d1d5db" />
                    <Text fontSize="$4" color="$gray10" textAlign="center">
                      No scheduled workouts for today
                    </Text>
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
                      <YStack gap="$1">
                        <Text fontSize="$2" color="$gray10">
                          {workout.day_of_week}
                        </Text>
                        <Text fontSize="$5" fontWeight="bold" color="$gray12">
                          {workout.name}
                        </Text>
                        {workout.description && (
                          <Text fontSize="$3" color="$gray10" numberOfLines={2}>
                            {workout.description}
                          </Text>
                        )}
                      </YStack>
                      <Button
                        size="$4"
                        backgroundColor="#16a34a"
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

      </YStack>
    </SafeAreaView>
  );
}