import { router } from 'expo-router';
import { Clock, Dumbbell } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

interface ActiveWorkoutBarProps {
  workoutName: string;
  startTime: number | string; // Unix timestamp in ms or ISO string
  exerciseCount: number;
  onPress?: () => void;
}

export function ActiveWorkoutBar({ 
  workoutName, 
  startTime, 
  exerciseCount,
  onPress 
}: ActiveWorkoutBarProps) {
  const [elapsedTime, setElapsedTime] = useState('00:00');

  useEffect(() => {
    const startMs = typeof startTime === 'number' 
      ? startTime 
      : new Date(startTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startMs) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      setElapsedTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/workout');
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
      style={{
        width: '100%',
        backgroundColor: '#7c3aed',
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
      }}
    >
      <XStack ai="center" jc="space-between">
        <YStack gap="$1" f={1}>
          <Text fontSize="$3" fontWeight="600" color="white">
            {workoutName}
          </Text>
          <XStack ai="center" gap="$3">
            <XStack ai="center" gap="$1">
              <Clock size={14} color="rgba(255,255,255,0.9)" />
              <Text fontSize="$2" color="rgba(255,255,255,0.9)">
                {elapsedTime}
              </Text>
            </XStack>
            <XStack ai="center" gap="$1">
              <Dumbbell size={14} color="rgba(255,255,255,0.9)" />
              <Text fontSize="$2" color="rgba(255,255,255,0.9)">
                {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}
              </Text>
            </XStack>
          </XStack>
        </YStack>
        <YStack 
          backgroundColor="rgba(255,255,255,0.2)"
          px="$3"
          py="$2"
          borderRadius="$2"
        >
          <Text fontSize="$2" fontWeight="600" color="white">
            RESUME
          </Text>
        </YStack>
      </XStack>
    </TouchableOpacity>
  );
}