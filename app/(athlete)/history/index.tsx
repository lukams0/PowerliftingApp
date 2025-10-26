import { router } from 'expo-router';
import { Calendar, Clock, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Spinner, Text, XStack, YStack } from 'tamagui';
import { ActiveWorkoutBar } from '../../../components/ActiveWorkoutBar';
import { useAuth } from '../../../contexts/AuthContext';
import { WorkoutSession, workoutSessionService } from '../../../services/workoutsession.service';

export default function HistoryScreen() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
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
    loadSessions();
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await workoutSessionService.getAthleteSessions(user.id);
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  };

  const handleWorkoutPress = (workoutId: string) => {
    router.push({
      pathname: '/(athlete)/history/[workoutId]',
      params: { workoutId }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '0 min';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

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
                History
              </Text>
              <Text fontSize="$4" color="$gray10">
                Your workout history
              </Text>
            </YStack>

            {/* Stats Card */}
            <Card elevate size="$4" p="$4" backgroundColor="white">
              <XStack gap="$4" jc="space-around">
                <YStack ai="center" gap="$1">
                  <Text fontSize="$7" fontWeight="bold" color="#7c3aed">
                    {sessions.length}
                  </Text>
                  <Text fontSize="$2" color="$gray10">Workouts</Text>
                </YStack>
                <YStack ai="center" gap="$1">
                  <Text fontSize="$7" fontWeight="bold" color="#7c3aed">
                    {sessions.filter(s => {
                      const date = new Date(s.start_time);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return date >= weekAgo;
                    }).length}
                  </Text>
                  <Text fontSize="$2" color="$gray10">This Week</Text>
                </YStack>
                <YStack ai="center" gap="$1">
                  <Text fontSize="$7" fontWeight="bold" color="#7c3aed">
                    {Math.round(
                      sessions.reduce((sum, s) => sum + (s.total_volume_lbs || 0), 0) / 1000
                    )}k
                  </Text>
                  <Text fontSize="$2" color="$gray10">Total lbs</Text>
                </YStack>
              </XStack>
            </Card>

            {/* Loading State */}
            {loading && (
              <YStack ai="center" py="$8">
                <Spinner size="large" color="#7c3aed" />
                <Text fontSize="$3" color="$gray10" mt="$3">
                  Loading your workouts...
                </Text>
              </YStack>
            )}

            {/* Empty State */}
            {!loading && sessions.length === 0 && (
              <Card elevate size="$4" p="$6" backgroundColor="white">
                <YStack ai="center" gap="$3">
                  <Calendar size={48} color="#d1d5db" />
                  <YStack ai="center" gap="$2">
                    <Text fontSize="$5" fontWeight="bold" color="$gray12" textAlign="center">
                      No Workouts Yet
                    </Text>
                    <Text fontSize="$3" color="$gray10" textAlign="center">
                      Start your first workout from the Home tab to see your history here.
                    </Text>
                  </YStack>
                </YStack>
              </Card>
            )}

            {/* Workout List */}
            {!loading && sessions.length > 0 && (
              <YStack gap="$3">
                {sessions.map((session) => (
                  <Card
                    key={session.id}
                    elevate
                    size="$4"
                    p="$4"
                    backgroundColor="white"
                    pressStyle={{ opacity: 0.7, scale: 0.98 }}
                    onPress={() => handleWorkoutPress(session.id)}
                  >
                    <YStack gap="$3">
                      <XStack ai="center" jc="space-between">
                        <YStack gap="$1">
                          <Text fontSize="$2" color="$gray10">
                            {formatDate(session.start_time)}
                          </Text>
                          <Text fontSize="$5" fontWeight="bold" color="$gray12">
                            {session.name}
                          </Text>
                        </YStack>
                        {session.end_time && (
                          <XStack
                            backgroundColor="#dcfce7"
                            px="$2"
                            py="$1"
                            borderRadius="$2"
                          >
                            <Text fontSize="$1" fontWeight="600" color="#16a34a">
                              COMPLETED
                            </Text>
                          </XStack>
                        )}
                      </XStack>

                      <XStack gap="$4">
                        <XStack ai="center" gap="$2">
                          <Clock size={16} color="#6b7280" />
                          <Text fontSize="$3" color="$gray10">
                            {formatDuration(session.duration_minutes)}
                          </Text>
                        </XStack>
                        {session.total_volume_lbs && (
                          <XStack ai="center" gap="$2">
                            <TrendingUp size={16} color="#6b7280" />
                            <Text fontSize="$3" color="$gray10">
                              {session.total_volume_lbs.toLocaleString()} lbs
                            </Text>
                          </XStack>
                        )}
                      </XStack>

                      {session.notes && (
                        <Text fontSize="$3" color="$gray10" numberOfLines={2}>
                          {session.notes}
                        </Text>
                      )}
                    </YStack>
                  </Card>
                ))}
              </YStack>
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