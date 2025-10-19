import { Redirect, Slot, useRootNavigationState, useSegments } from "expo-router";
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';

export default function RootLayout() {
  const isLoggedIn = false;
  const navState = useRootNavigationState();
  const segments = useSegments();

  return (
    <TamaguiProvider config={config}>
      {!navState?.key ? (
        <Slot />
      ) : segments[0] !== "(auth)" ? (
        <Redirect href="/(auth)/sign-in" />
      ) : (
        <Slot />
      )}
    </TamaguiProvider>
  );
}