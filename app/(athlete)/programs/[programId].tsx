import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Progress, Spinner, Text, XStack, YStack } from 'tamagui';
import { useAuth } from '../../../contexts/AuthContext';
import { programService } from '../../../services/program.service';
import type { ProgramWithDetails } from '../../../services/program.service';

export default function ProgramDetailPage() {
  const { programId } = useLocalSearchParams();
  const { user } = useAuth();
  const [program, setProgram] = useState<ProgramWithDetails | null>(null);
  const [athleteProgram, setAthleteProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgram();
  }, [programId, user]);

  const loadProgram = async () => {
    if (!programId || !user) return;

    try {
      setLoading(true);

      // Fetch program details
      const programData = await programService.getProgramDetails(programId as string);
      setProgram(programData);

      // Fetch athlete's enrollment to get current week and status
      const athletePrograms = await programService.getAthletePrograms(user.id);
      const enrollment = athletePrograms.find(ap => ap.program_id === programId);
      setAthleteProgram(enrollment);
    } catch (error) {
      console.error('Error loading program:', error);
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
            Loading program...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (!program) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center" p="$4">
          <Text fontSize="$5" color="$gray11" textAlign="center">
            Program not found
          </Text>
          <Button mt="$4" onPress={() => router.back()}>
            Go Back
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }

  const currentWeek = athleteProgram?.current_week || 1;
  const progressPercentage = (currentWeek / program.duration_weeks) * 100;

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

  // Calculate block status based on current week
  const getBlockStatus = (block: any) => {
    if (currentWeek < block.start_week) return 'upcoming';
    if (currentWeek > block.end_week) return 'completed';
    return 'active';
  };

  // Calculate workouts per week (count unique days in first week of block)
  const getWorkoutsPerWeek = (block: any) => {
    const uniqueDays = new Set(block.workouts.map((w: any) => w.day_of_week));
    return uniqueDays.size || 0;
  };

  // Format start date
  const startDate = athleteProgram?.start_date
    ? new Date(athleteProgram.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';

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
              {program.difficulty_level ? program.difficulty_level.charAt(0).toUpperCase() + program.difficulty_level.slice(1) : 'All Levels'}
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
                    Week {currentWeek} of {program.duration_weeks}
                  </Text>
                  <Text fontSize="$3" color="rgba(255,255,255,0.9)">
                    Started {startDate}
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
                    {program.duration_weeks}
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
                const blockStatus = getBlockStatus(block);
                const statusColors = getBlockStatusColor(blockStatus);
                const weekCount = block.end_week - block.start_week + 1;
                const blockCurrentWeek = blockStatus === 'active' ? currentWeek - block.start_week + 1 : 0;
                const workoutsPerWeek = getWorkoutsPerWeek(block);

                return (
                  <Card
                    key={block.id}
                    elevate
                    size="$4"
                    p="$4"
                    backgroundColor={blockStatus === 'active' ? '#faf5ff' : 'white'}
                    borderWidth={blockStatus === 'active' ? 2 : 0}
                    borderColor={blockStatus === 'active' ? '#7c3aed' : 'transparent'}
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
                            {blockStatus === 'active' && (
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
                            Weeks {block.start_week}-{block.end_week} • {weekCount} week{weekCount > 1 ? 's' : ''}
                          </Text>
                        </YStack>
                        {blockStatus === 'completed' && (
                          <CheckCircle size={24} color="#16a34a" />
                        )}
                      </XStack>

                      {blockStatus === 'active' && blockCurrentWeek > 0 && (
                        <YStack gap="$1">
                          <XStack ai="center" jc="space-between">
                            <Text fontSize="$2" color="$gray10">
                              Week {blockCurrentWeek} of {weekCount}
                            </Text>
                            <Text fontSize="$2" color="#7c3aed" fontWeight="600">
                              {Math.round((blockCurrentWeek / weekCount) * 100)}%
                            </Text>
                          </XStack>
                          <Progress value={(blockCurrentWeek / weekCount) * 100} max={100} size="$2">
                            <Progress.Indicator animation="bouncy" backgroundColor="#7c3aed" />
                          </Progress>
                        </YStack>
                      )}

                      <YStack gap="$1">
                        {block.description && (
                          <Text fontSize="$3" color="$gray11">
                            {block.description}
                          </Text>
                        )}
                        {block.focus && (
                          <Text fontSize="$3" color="$gray11" fontStyle="italic">
                            Focus: {block.focus}
                          </Text>
                        )}
                        {workoutsPerWeek > 0 && (
                          <Text fontSize="$2" color="$gray10">
                            {workoutsPerWeek} workouts per week
                          </Text>
                        )}
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