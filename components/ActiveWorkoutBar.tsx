import { router } from 'expo-router';
import { ChevronUp, Clock, Dumbbell } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Card, Text, XStack, YStack } from 'tamagui';

type ActiveWorkoutBarProps = {
  workoutName: string;
  startTime: number;
  exerciseCount: number;
  onPress?: () => void;
};

export function ActiveWorkoutBar({ 
  workoutName, 
  startTime, 
  exerciseCount,
  onPress 
}: ActiveWorkoutBarProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/workout');
    }
  };

  return (
    <Card
      elevate
      backgroundColor="#7c3aed"
      p="$3"
      mx="$3"
      mb="$2"
      borderRadius="$4"
      pressStyle={{ opacity: 0.9, scale: 0.98 }}
      onPress={handlePress}
      animation="quick"
    >
      <XStack ai="center" jc="space-between">
        <YStack f={1} gap="$1">
          <Text fontSize="$4" fontWeight="bold" color="white">
            {workoutName}
          </Text>
          <XStack ai="center" gap="$3">
            <XStack ai="center" gap="$1">
              <Clock size={14} color="white" />
              <Text fontSize="$2" color="rgba(255,255,255,0.9)">
                {formatTime(elapsedTime)}
              </Text>
            </XStack>
            {exerciseCount > 0 && (
              <XStack ai="center" gap="$1">
                <Dumbbell size={14} color="white" />
                <Text fontSize="$2" color="rgba(255,255,255,0.9)">
                  {exerciseCount} exercises
                </Text>
              </XStack>
            )}
          </XStack>
        </YStack>
        <XStack
          backgroundColor="rgba(255,255,255,0.2)"
          px="$3"
          py="$2"
          borderRadius="$3"
          ai="center"
          gap="$1"
        >
          <Text fontSize="$3" fontWeight="600" color="white">
            Resume
          </Text>
          <ChevronUp size={16} color="white" />
        </XStack>
      </XStack>
    </Card>
  );
}