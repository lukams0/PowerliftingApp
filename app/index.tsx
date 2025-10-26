import { Redirect } from 'expo-router';
import { Spinner, Text, YStack } from 'tamagui';
import { useAuth } from '../contexts/AuthContext';
export default function Index() {
  const { user, loading } = useAuth();
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

  // If user is logged in, redirect to athlete home
  if (user) {
    return <Redirect href="/(athlete)" />;
  }

  // Otherwise redirect to sign in
  return <Redirect href="/(auth)/sign-in" />;
}