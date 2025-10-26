import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, Spinner, Text, YStack } from 'tamagui';
import { useAuth } from '../contexts/AuthContext';

/**
 * Component to handle orphaned sessions (user with no profile)
 * Shows user a message and lets them clear the session
 */
export function SessionCleaner() {
  const { signOut, loading: authLoading } = useAuth();
  const [clearing, setClearing] = useState(false);

  const handleClearSession = async () => {
    try {
      setClearing(true);
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('Error clearing session:', error);
      // Force navigation anyway
      router.replace('/(auth)/sign-in');
    }
  };

  if (clearing || authLoading) {
    return (
      <YStack f={1} ai="center" jc="center" backgroundColor="#f5f5f5" p="$4">
        <Spinner size="large" color="#7c3aed" />
        <Text fontSize="$4" color="$gray10" mt="$4">
          Clearing session...
        </Text>
      </YStack>
    );
  }

  return (
    <YStack f={1} ai="center" jc="center" backgroundColor="#f5f5f5" p="$4" gap="$4">
      <YStack
        backgroundColor="#fee2e2"
        p="$4"
        borderRadius="$4"
        borderWidth={1}
        borderColor="#ef4444"
        maxWidth={400}
        gap="$3"
      >
        <Text fontSize="$6" fontWeight="bold" color="#dc2626" textAlign="center">
          Session Issue
        </Text>
        <Text fontSize="$3" color="#991b1b" textAlign="center" lineHeight="$4">
          Your profile data is missing. This can happen if:
          {'\n'}• Your account is incomplete
          {'\n'}• Your profile was deleted
          {'\n'}• There was a database error
        </Text>
      </YStack>

      <YStack gap="$3" w="100%" maxWidth={400}>
        <Button
          size="$5"
          backgroundColor="#7c3aed"
          color="white"
          onPress={handleClearSession}
          pressStyle={{ backgroundColor: '#6d28d9' }}
        >
          Clear Session & Sign In Again
        </Button>

        <Text fontSize="$2" color="$gray10" textAlign="center">
          You'll be taken to the sign-in screen
        </Text>
      </YStack>
    </YStack>
  );
}