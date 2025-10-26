import { Redirect } from 'expo-router';
import React, { ReactNode } from 'react';
import { Spinner, Text, YStack } from 'tamagui';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
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

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <>{children}</>;
}