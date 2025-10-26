import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';
import { authService } from '../../services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleResetPassword = async () => {
    try {
      setError('');
      setSuccess(false);

      if (!email) {
        setError('Please enter your email address');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }

      setLoading(true);
      await authService.resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack 
      f={1} 
      ai="center" 
      jc="center" 
      backgroundColor="#f5f5f5"
      p="$4"
      onPress={() => Keyboard.dismiss()}
    >
      <Card 
        elevate 
        size="$4" 
        w="100%" 
        maxWidth={400}
        p="$6"
        gap="$4"
      >
        {/* Header with Back Button */}
        <XStack ai="center" gap="$3" mb="$2">
          <Button
            size="$3"
            chromeless
            onPress={handleBack}
            pressStyle={{ opacity: 0.7 }}
          >
            <ArrowLeft size={24} color="#6b7280" />
          </Button>
          <YStack f={1}>
            <Text fontSize="$8" fontWeight="bold" color="#7c3aed">
              Reset Password
            </Text>
          </YStack>
        </XStack>

        {!success ? (
          <>
            <Text fontSize="$4" color="$gray10" lineHeight="$4">
              Enter your email address and we'll send you a link to reset your password.
            </Text>

            {/* Error Message */}
            {error && (
              <YStack
                backgroundColor="#fee2e2"
                p="$3"
                borderRadius="$3"
                borderWidth={1}
                borderColor="#ef4444"
              >
                <Text fontSize="$3" color="#dc2626">
                  {error}
                </Text>
              </YStack>
            )}

            {/* Email Input */}
            <YStack gap="$2">
              <Text color="$gray11" fontSize="$3">
                Email
              </Text>
              <Input
                size="$4"
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                borderColor="#e9d5ff"
                focusStyle={{ borderColor: '#7c3aed' }}
              />
            </YStack>

            {/* Send Reset Link Button */}
            <Button
              size="$5"
              backgroundColor="#7c3aed"
              color="white"
              onPress={handleResetPassword}
              disabled={loading || !email}
              opacity={loading || !email ? 0.5 : 1}
              pressStyle={{ backgroundColor: '#6d28d9' }}
              mt="$2"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </>
        ) : (
          <>
            {/* Success Message */}
            <YStack
              backgroundColor="#dcfce7"
              p="$4"
              borderRadius="$3"
              borderWidth={1}
              borderColor="#86efac"
              gap="$3"
              ai="center"
            >
              <Text fontSize="$7">✓</Text>
              <YStack ai="center" gap="$2">
                <Text fontSize="$5" fontWeight="bold" color="#16a34a" textAlign="center">
                  Check Your Email
                </Text>
                <Text fontSize="$3" color="#15803d" textAlign="center" lineHeight="$4">
                  We've sent a password reset link to {email}
                </Text>
              </YStack>
            </YStack>

            <Text fontSize="$3" color="$gray10" textAlign="center" lineHeight="$4">
              Didn't receive the email? Check your spam folder or try again.
            </Text>

            {/* Back to Sign In Button */}
            <Button
              size="$5"
              backgroundColor="white"
              borderColor="#e9d5ff"
              borderWidth={2}
              color="#7c3aed"
              onPress={handleBack}
              pressStyle={{ backgroundColor: '#faf5ff' }}
            >
              Back to Sign In
            </Button>
          </>
        )}
      </Card>
    </YStack>
  );
}