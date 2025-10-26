import { router } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Moon,
  Ruler,
  Scale,
  User
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Separator, Text, XStack, YStack } from 'tamagui';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsModal() {
  const { signOut, loading } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/sign-in');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const SettingRow = ({ 
    icon: Icon, 
    title, 
    value, 
    onPress, 
    showArrow = true,
    rightElement 
  }: { 
    icon: any; 
    title: string; 
    value?: string; 
    onPress?: () => void;
    showArrow?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <XStack
      ai="center"
      jc="space-between"
      py="$4"
      px="$4"
      pressStyle={{ opacity: 0.7, backgroundColor: '#fafafa' }}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <XStack ai="center" gap="$3" f={1}>
        <Icon size={22} color="#7c3aed" />
        <YStack f={1}>
          <Text fontSize="$4" color="$gray12" fontWeight="500">
            {title}
          </Text>
          {value && (
            <Text fontSize="$3" color="$gray10">
              {value}
            </Text>
          )}
        </YStack>
      </XStack>
      {rightElement || (showArrow && onPress && (
        <ChevronRight size={20} color="#9ca3af" />
      ))}
    </XStack>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        {/* Header */}
        <XStack
          backgroundColor="#f5f5f5"
          p="$4"
          ai="center"
          gap="$3"
        >
          <Button
            size="$3"
            chromeless
            onPress={handleBack}
            pressStyle={{ opacity: 0.7 }}
          >
            <ArrowLeft size={24} color="#6b7280" />
          </Button>
          <Text fontSize="$7" fontWeight="bold" color="$gray12">
            Settings
          </Text>
        </XStack>

        <ScrollView>
          <YStack p="$4" gap="$4">
            {/* Account Section */}
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$gray11" px="$2">
                ACCOUNT
              </Text>
              <Card elevate backgroundColor="white" overflow="hidden">
                <YStack>
                  <SettingRow
                    icon={User}
                    title="Profile Information"
                    value="Name, email, and more"
                    onPress={() => router.push('/settings/profile')}
                  />
                  <Separator />
                  <SettingRow
                    icon={Lock}
                    title="Password & Security"
                    value="Change your password"
                    onPress={() => router.push('/settings/security')}
                  />
                </YStack>
              </Card>
            </YStack>

            {/* Preferences Section */}
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$gray11" px="$2">
                PREFERENCES
              </Text>
              <Card elevate backgroundColor="white" overflow="hidden">
                <YStack>
                  <SettingRow
                    icon={Bell}
                    title="Notifications"
                    showArrow={false}
                    rightElement={
                      <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                        thumbColor={notificationsEnabled ? '#7c3aed' : '#f3f4f6'}
                      />
                    }
                  />
                  <Separator />
                  <SettingRow
                    icon={Moon}
                    title="Dark Mode"
                    showArrow={false}
                    rightElement={
                      <Switch
                        value={darkModeEnabled}
                        onValueChange={setDarkModeEnabled}
                        trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                        thumbColor={darkModeEnabled ? '#7c3aed' : '#f3f4f6'}
                      />
                    }
                  />
                  <Separator />
                  <SettingRow
                    icon={Globe}
                    title="Language"
                    value="English"
                    onPress={() => console.log('Language')}
                  />
                </YStack>
              </Card>
            </YStack>

            {/* Units Section */}
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$gray11" px="$2">
                UNITS
              </Text>
              <Card elevate backgroundColor="white" overflow="hidden">
                <YStack>
                  <SettingRow
                    icon={Scale}
                    title="Weight Units"
                    value="Pounds (lbs)"
                    onPress={() => router.push('/settings/units')}
                  />
                  <Separator />
                  <SettingRow
                    icon={Ruler}
                    title="Distance Units"
                    value="Imperial (ft/in)"
                    onPress={() => router.push('/settings/units')}
                  />
                </YStack>
              </Card>
            </YStack>

            {/* Support Section */}
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$gray11" px="$2">
                SUPPORT
              </Text>
              <Card elevate backgroundColor="white" overflow="hidden">
                <YStack>
                  <SettingRow
                    icon={HelpCircle}
                    title="Help & Support"
                    onPress={() => router.push('/settings/help')}
                  />
                  <Separator />
                  <XStack
                    ai="center"
                    jc="space-between"
                    py="$4"
                    px="$4"
                  >
                    <XStack ai="center" gap="$3">
                      <Text fontSize="$4" color="$gray11" fontWeight="500">
                        Version
                      </Text>
                    </XStack>
                    <Text fontSize="$4" color="$gray10">
                      1.0.0
                    </Text>
                  </XStack>
                </YStack>
              </Card>
            </YStack>

            {/* Logout Button */}
            <Button
              size="$5"
              backgroundColor="white"
              borderColor="#fee2e2"
              borderWidth={2}
              onPress={handleLogout}
              disabled={loading}
              opacity={loading ? 0.5 : 1}
              pressStyle={{ backgroundColor: '#fef2f2' }}
              mt="$2"
            >
              <XStack ai="center" gap="$2">
                <LogOut size={20} color="#ef4444" />
                <Text fontSize="$5" fontWeight="600" color="#ef4444">
                  {loading ? 'Logging Out...' : 'Log Out'}
                </Text>
              </XStack>
            </Button>

            {/* Bottom Spacing */}
            <YStack h={40} />
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}