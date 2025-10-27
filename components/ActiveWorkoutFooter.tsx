import { useIsFocused } from '@react-navigation/native';
import { Platform } from 'react-native';
import { YStack } from 'tamagui';
import { useWorkout } from '../contexts/WorkoutContext';
import { ActiveWorkoutBar } from './ActiveWorkoutBar';

type ActiveWorkoutFooterProps = {
  onPress?: () => void;
};

export function ActiveWorkoutFooter({ onPress }: ActiveWorkoutFooterProps) {
  const { isWorkoutActive, activeSession, startTime } = useWorkout();
  const isFocused = useIsFocused();

  if (!isFocused || !isWorkoutActive || !activeSession || !startTime) {
    return null;
  }

  const sessionWithExercises = activeSession as typeof activeSession & {
    exercises?: unknown[];
  };

  const exerciseCount = Array.isArray(sessionWithExercises.exercises)
    ? sessionWithExercises.exercises.length
    : 0;

  return (
    <YStack
      position="absolute"
      bottom={Platform.OS === 'ios' ? 88 : 60}
      left={0}
      right={0}
      pointerEvents="box-none"
    >
      <ActiveWorkoutBar
        workoutName={activeSession.name}
        startTime={startTime}
        exerciseCount={exerciseCount}
        onPress={onPress}
      />
    </YStack>
  );
}
