import { Redirect } from 'expo-router';
import { Spinner, Text, YStack } from 'tamagui';
import { SessionCleaner } from '../components/SessionCleaner';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <YStack f={1} ai="center" jc="center" backgroundColor="#f5f5f5">
        <Spinner size="large" color="#7c3aed" />
        <Text fontSize="$4" color="$gray10" mt="$4">
          Loading...
        </Text>
      </YStack>
    );
  }

  // No user - go to sign in
  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // User exists but no profile - this means profile was deleted or signup didn't complete
  // Show a screen to clear the session
  if (!profile) {
    console.warn('User exists but no profile found.');
    return <SessionCleaner />;
  }

  // User and profile exist - go to athlete home
  return <Redirect href="/(athlete)" />;
}