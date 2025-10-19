import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock, Save, Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    setIsSaving(true);
    // TODO: Save to backend/database
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Changing password');
    setIsSaving(false);
    alert('Password updated successfully!');
    
    // Clear fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
              Password & Security
            </Text>
          </XStack>

          <ScrollView>
            <YStack p="$4" gap="$4">
              {/* Info Card */}
              <Card elevate size="$4" p="$4" backgroundColor="#eff6ff">
                <XStack gap="$3">
                  <Shield size={24} color="#3b82f6" />
                  <YStack f={1} gap="$1">
                    <Text fontSize="$4" fontWeight="600" color="#1e40af">
                      Keep Your Account Secure
                    </Text>
                    <Text fontSize="$3" color="#1e3a8a" lineHeight="$3">
                      Use a strong password with at least 8 characters, including numbers and special characters.
                    </Text>
                  </YStack>
                </XStack>
              </Card>

              {/* Current Password */}
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <XStack ai="center" gap="$2">
                    <Lock size={20} color="#7c3aed" />
                    <Text fontSize="$4" fontWeight="600" color="$gray12">
                      Current Password
                    </Text>
                  </XStack>
                  <XStack ai="center" gap="$2">
                    <Input
                      f={1}
                      size="$4"
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      placeholder="Enter current password"
                      secureTextEntry={!showCurrent}
                      autoCapitalize="none"
                      borderColor="#e9d5ff"
                      focusStyle={{ borderColor: '#7c3aed' }}
                    />
                    <Button
                      size="$4"
                      chromeless
                      onPress={() => setShowCurrent(!showCurrent)}
                      pressStyle={{ opacity: 0.7 }}
                    >
                      {showCurrent ? (
                        <EyeOff size={20} color="#9ca3af" />
                      ) : (
                        <Eye size={20} color="#9ca3af" />
                      )}
                    </Button>
                  </XStack>
                </YStack>
              </Card>

              {/* New Password */}
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <XStack ai="center" gap="$2">
                    <Lock size={20} color="#7c3aed" />
                    <Text fontSize="$4" fontWeight="600" color="$gray12">
                      New Password
                    </Text>
                  </XStack>
                  <XStack ai="center" gap="$2">
                    <Input
                      f={1}
                      size="$4"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Enter new password"
                      secureTextEntry={!showNew}
                      autoCapitalize="none"
                      borderColor="#e9d5ff"
                      focusStyle={{ borderColor: '#7c3aed' }}
                    />
                    <Button
                      size="$4"
                      chromeless
                      onPress={() => setShowNew(!showNew)}
                      pressStyle={{ opacity: 0.7 }}
                    >
                      {showNew ? (
                        <EyeOff size={20} color="#9ca3af" />
                      ) : (
                        <Eye size={20} color="#9ca3af" />
                      )}
                    </Button>
                  </XStack>
                  {newPassword && newPassword.length < 8 && (
                    <Text fontSize="$2" color="#ef4444">
                      Password must be at least 8 characters
                    </Text>
                  )}
                </YStack>
              </Card>

              {/* Confirm New Password */}
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  <XStack ai="center" gap="$2">
                    <Lock size={20} color="#7c3aed" />
                    <Text fontSize="$4" fontWeight="600" color="$gray12">
                      Confirm New Password
                    </Text>
                  </XStack>
                  <XStack ai="center" gap="$2">
                    <Input
                      f={1}
                      size="$4"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm new password"
                      secureTextEntry={!showConfirm}
                      autoCapitalize="none"
                      borderColor="#e9d5ff"
                      focusStyle={{ borderColor: '#7c3aed' }}
                    />
                    <Button
                      size="$4"
                      chromeless
                      onPress={() => setShowConfirm(!showConfirm)}
                      pressStyle={{ opacity: 0.7 }}
                    >
                      {showConfirm ? (
                        <EyeOff size={20} color="#9ca3af" />
                      ) : (
                        <Eye size={20} color="#9ca3af" />
                      )}
                    </Button>
                  </XStack>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <Text fontSize="$2" color="#ef4444">
                      Passwords do not match
                    </Text>
                  )}
                </YStack>
              </Card>

              {/* Save Button */}
              <Button
                size="$5"
                backgroundColor="#7c3aed"
                color="white"
                onPress={handleSave}
                disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                opacity={isSaving || !currentPassword || !newPassword || !confirmPassword ? 0.5 : 1}
                pressStyle={{ backgroundColor: '#6d28d9' }}
                mt="$2"
              >
                <XStack ai="center" gap="$2">
                  <Save size={20} color="white" />
                  <Text fontSize="$5" fontWeight="bold" color="white">
                    {isSaving ? 'Updating...' : 'Update Password'}
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </ScrollView>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}