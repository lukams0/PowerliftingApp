import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Spinner, Text, YStack } from 'tamagui';
import { SessionCleaner } from '../components/SessionCleaner';
import { useAuth } from '../contexts/AuthContext';

// Maximum time to wait for loading (15 seconds)
const MAX_LOADING_TIME = 15000;

export default function Index() {
  const { user, profile, loading } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Set up a timeout for loading state
  useEffect(() => {
    if (loading) {
      console.log('Index: Starting loading timeout timer');
      const timer = setTimeout(() => {
        console.error('❌ Loading timeout reached - still loading after', MAX_LOADING_TIME / 1000, 'seconds');
        console.log('Current state:', { user: !!user, profile: !!profile, loading });
        setLoadingTimeout(true);
      }, MAX_LOADING_TIME);

      return () => {
        console.log('Index: Clearing loading timeout timer');
        clearTimeout(timer);
      };
    } else {
      console.log('Index: Loading complete');
      setLoadingTimeout(false);
    }
  }, [loading]);

  // Log state changes
  useEffect(() => {
    console.log('Index: State changed:', {
      loading,
      hasUser: !!user,
      hasProfile: !!profile,
      loadingTimeout,
    });
  }, [loading, user, profile, loadingTimeout]);

  // If loading timed out, show error
  if (loadingTimeout) {
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
            Loading Timeout
          </Text>
          <Text fontSize="$3" color="#991b1b" textAlign="center" lineHeight="$4">
            The app took too long to load your profile. This usually means:
            {'\n'}• Network connection is slow or unavailable
            {'\n'}• Database is not responding
            {'\n'}• Session is corrupted
          </Text>
        </YStack>

        <YStack gap="$3" w="100%" maxWidth={400}>
          <Text fontSize="$2" color="$gray10" textAlign="center">
            Current state:
            {'\n'}User: {user ? '✓' : '✗'}
            {'\n'}Profile: {profile ? '✓' : '✗'}
            {'\n'}Loading: {loading ? '✓' : '✗'}
          </Text>
        </YStack>
      </YStack>
    );
  }

  if (loading) {
    return (
      <YStack f={1} ai="center" jc="center" backgroundColor="#f5f5f5">
        <Spinner size="large" color="#7c3aed" />
        <Text fontSize="$4" color="$gray10" mt="$4">
          Loading...
        </Text>
        <Text fontSize="$2" color="$gray9" mt="$2">
          Checking authentication
        </Text>
      </YStack>
    );
  }

  // No user - go to sign in
  if (!user) {
    console.log('Index: No user, redirecting to sign in');
    return <Redirect href="/(auth)/sign-in" />;
  }

  // User exists but no profile - this means profile was deleted or signup didn't complete
  // Show a screen to clear the session
  if (!profile) {
    console.warn('Index: User exists but no profile found');
    return <SessionCleaner />;
  }

  // User and profile exist - go to athlete home
  console.log('Index: User and profile exist, redirecting to athlete home');
  return <Redirect href="/(athlete)" />;
}