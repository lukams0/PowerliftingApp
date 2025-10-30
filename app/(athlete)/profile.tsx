import { router } from 'expo-router';
import { Award, Calendar, Ruler, Scale, Settings, TrendingUp, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Spinner, Text, XStack, YStack } from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/profile.service';
import { personalRecordService } from '../../services/personalrecord.service';
import { AthleteProfile, PersonalRecordWithExercise } from '../../types/database.types';

export default function ProfileScreen() {
  const { user, profile } = useAuth();
  const [athleteProfile, setAthleteProfile] = useState<AthleteProfile | null>(null);
  const [topPRs, setTopPRs] = useState<PersonalRecordWithExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAthleteProfile();
  }, [user]);

  const loadAthleteProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await profileService.getAthleteProfile(user.id);
      setAthleteProfile(data);

      // Load top 5 personal records
      const prs = await personalRecordService.getTopPRs(user.id, 5);
      setTopPRs(prs);
    } catch (error) {
      console.error('Error loading athlete profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAthleteProfile();
    setRefreshing(false);
  };

  const handleSettingsPress = () => {
    router.push('/settings.modal');
  };

  const getExperienceLevelDisplay = (level: string | null | undefined) => {
    if (!level) return 'Not Set';
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const formatHeight = (inches: number | null | undefined) => {
    if (!inches) return 'Not Set';
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };

  const formatWeight = (lbs: number | null | undefined) => {
    if (!lbs) return 'Not Set';
    return `${Math.round(lbs)} lbs`;
  };

  const getGenderDisplay = (gender: string | null | undefined) => {
    if (!gender) return 'Not Set';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$4" color="$gray10" mt="$4">
            Loading profile...
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
                Profile
              </Text>
              <Button
                size="$3"
                chromeless
                color="$gray11"
                onPress={handleSettingsPress}
                pressStyle={{ opacity: 0.7 }}
              >
                <Settings size={24} color="#6b7280" />
              </Button>
            </XStack>

            {/* User Info Card */}
            <Card elevate size="$4" p="$5" backgroundColor="white">
              <YStack ai="center" gap="$3">
                <YStack
                  w={80}
                  h={80}
                  borderRadius="$12"
                  backgroundColor="#7c3aed"
                  ai="center"
                  jc="center"
                >
                  <User size={40} color="white" />
                </YStack>
                <YStack ai="center" gap="$1">
                  <Text fontSize="$7" fontWeight="bold" color="$gray12">
                    {profile?.full_name || 'User'}
                  </Text>
                  <Text fontSize="$4" color="$gray10">
                    {getExperienceLevelDisplay(athleteProfile?.experience_level)} Lifter
                  </Text>
                  {athleteProfile?.age && (
                    <Text fontSize="$3" color="$gray10">
                      {athleteProfile.age} years old
                    </Text>
                  )}
                </YStack>
              </YStack>
            </Card>

            {/* Profile Completion Notice */}
            {!athleteProfile && (
              <Card elevate size="$4" p="$4" backgroundColor="#fef3c7">
                <YStack gap="$3">
                  <Text fontSize="$4" fontWeight="bold" color="#92400e">
                    Complete Your Profile
                  </Text>
                  <Text fontSize="$3" color="#78350f" lineHeight="$4">
                    Add your information to get personalized recommendations and track your progress.
                  </Text>
                  <Button
                    size="$4"
                    backgroundColor="#7c3aed"
                    color="white"
                    onPress={() => router.push('/settings/profile')}
                    pressStyle={{ backgroundColor: '#6d28d9' }}
                  >
                    Complete Profile
                  </Button>
                </YStack>
              </Card>
            )}

            {/* Stats Overview - Placeholder for future workout stats */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Stats Overview
              </Text>
              <XStack gap="$3">
                <Card elevate f={1} p="$4" backgroundColor="white">
                  <YStack gap="$2" ai="center">
                    <Text fontSize="$7" fontWeight="bold" color="#7c3aed">
                      0
                    </Text>
                    <Text fontSize="$3" color="$gray10" textAlign="center">
                      Workouts
                    </Text>
                  </YStack>
                </Card>
                <Card elevate f={1} p="$4" backgroundColor="white">
                  <YStack gap="$2" ai="center">
                    <Text fontSize="$7" fontWeight="bold" color="#7c3aed">
                      0
                    </Text>
                    <Text fontSize="$3" color="$gray10" textAlign="center">
                      Total Sets
                    </Text>
                  </YStack>
                </Card>
              </XStack>
            </YStack>

            {/* Body Stats */}
            {athleteProfile && (
              <YStack gap="$3">
                <XStack ai="center" gap="$2">
                  <TrendingUp size={20} color="#7c3aed" />
                  <Text fontSize="$5" fontWeight="bold" color="$gray12">
                    Body Stats
                  </Text>
                </XStack>
                <Card elevate size="$4" p="$4" backgroundColor="white">
                  <YStack gap="$3">
                    <XStack ai="center" jc="space-between">
                      <XStack ai="center" gap="$2">
                        <Scale size={18} color="#9ca3af" />
                        <Text fontSize="$4" color="$gray11">
                          Weight
                        </Text>
                      </XStack>
                      <Text fontSize="$5" fontWeight="bold" color="$gray12">
                        {formatWeight(athleteProfile.weight_lbs)}
                      </Text>
                    </XStack>
                    <XStack ai="center" jc="space-between">
                      <XStack ai="center" gap="$2">
                        <Ruler size={18} color="#9ca3af" />
                        <Text fontSize="$4" color="$gray11">
                          Height
                        </Text>
                      </XStack>
                      <Text fontSize="$5" fontWeight="bold" color="$gray12">
                        {formatHeight(athleteProfile.height_inches)}
                      </Text>
                    </XStack>
                    <XStack ai="center" jc="space-between">
                      <XStack ai="center" gap="$2">
                        <Calendar size={18} color="#9ca3af" />
                        <Text fontSize="$4" color="$gray11">
                          Gender
                        </Text>
                      </XStack>
                      <Text fontSize="$5" fontWeight="bold" color="$gray12">
                        {getGenderDisplay(athleteProfile.gender)}
                      </Text>
                    </XStack>
                  </YStack>
                </Card>
              </YStack>
            )}

            {/* Goals Section */}
            {athleteProfile?.goals && athleteProfile.goals.length > 0 && (
              <YStack gap="$3">
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Your Goals
                </Text>
                <Card elevate size="$4" p="$4" backgroundColor="white">
                  <YStack gap="$2">
                    {athleteProfile.goals.map((goal, index) => (
                      <XStack key={index} ai="center" gap="$2">
                        <YStack
                          w={8}
                          h={8}
                          borderRadius="$10"
                          backgroundColor="#7c3aed"
                        />
                        <Text fontSize="$4" color="$gray11">
                          {goal.charAt(0).toUpperCase() + goal.slice(1).replace('_', ' ')}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>
                </Card>
              </YStack>
            )}

            {/* Personal Records */}
            <YStack gap="$3">
              <XStack ai="center" gap="$2">
                <Award size={20} color="#7c3aed" />
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Personal Records
                </Text>
              </XStack>
              {topPRs.length === 0 ? (
                <Card elevate size="$4" p="$5" backgroundColor="#faf5ff">
                  <YStack ai="center" gap="$3">
                    <Award size={40} color="#7c3aed" />
                    <YStack ai="center" gap="$1">
                      <Text fontSize="$4" fontWeight="bold" color="$gray12" textAlign="center">
                        Track Your PRs
                      </Text>
                      <Text fontSize="$3" color="$gray10" textAlign="center">
                        Start logging workouts to track your personal records
                      </Text>
                    </YStack>
                  </YStack>
                </Card>
              ) : (
                <Card elevate size="$4" p="$4" backgroundColor="white">
                  <YStack gap="$3">
                    {topPRs.map((pr, index) => (
                      <XStack
                        key={pr.id}
                        ai="center"
                        jc="space-between"
                        pb="$3"
                        borderBottomWidth={index < topPRs.length - 1 ? 1 : 0}
                        borderBottomColor="$gray5"
                      >
                        <YStack f={1} gap="$1">
                          <XStack ai="center" gap="$2">
                            <XStack
                              backgroundColor="#fef3c7"
                              width={28}
                              height={28}
                              borderRadius="$10"
                              ai="center"
                              jc="center"
                            >
                              <Award size={16} color="#f59e0b" />
                            </XStack>
                            <Text fontSize="$4" fontWeight="600" color="$gray12">
                              {pr.exercise?.name || 'Unknown Exercise'}
                            </Text>
                          </XStack>
                          <Text fontSize="$2" color="$gray10" ml="$8">
                            {new Date(pr.achieved_at).toLocaleDateString()}
                          </Text>
                        </YStack>
                        <YStack ai="flex-end">
                          <Text fontSize="$5" fontWeight="bold" color="#7c3aed">
                            {pr.weight_lbs} lbs
                          </Text>
                          <Text fontSize="$2" color="$gray10">
                            {pr.reps} {pr.reps === 1 ? 'rep' : 'reps'}
                          </Text>
                        </YStack>
                      </XStack>
                    ))}
                  </YStack>
                </Card>
              )}
            </YStack>

            {/* Account Info */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Account
              </Text>
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <XStack ai="center" jc="space-between">
                    <Text fontSize="$4" color="$gray11">
                      Email
                    </Text>
                    <Text fontSize="$4" fontWeight="500" color="$gray12">
                      {profile?.email}
                    </Text>
                  </XStack>
                  <XStack ai="center" jc="space-between">
                    <Text fontSize="$4" color="$gray11">
                      Member Since
                    </Text>
                    <Text fontSize="$4" fontWeight="500" color="$gray12">
                      {profile?.created_at 
                        ? new Date(profile.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })
                        : 'N/A'}
                    </Text>
                  </XStack>
                </YStack>
              </Card>
            </YStack>
          </YStack>
        </ScrollView>

      </YStack>
    </SafeAreaView>
  );
}