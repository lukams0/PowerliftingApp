import React, { createContext, ReactNode, useContext, useState } from 'react';

type WorkoutSet = {
  id: string;
  reps: string;
  weight: string;
  rpe: string;
  completed: boolean;
};

type WorkoutExercise = {
  id: string;
  name: string;
  targetSets: number;
  targetReps: string;
  targetWeight: string;
  sets: WorkoutSet[];
};

type ActiveWorkout = {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  startTime: number;
} | null;

type WorkoutContextType = {
  activeWorkout: ActiveWorkout;
  startWorkout: (workout: ActiveWorkout) => void;
  endWorkout: () => void;
  isWorkoutActive: boolean;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout>(null);

  const startWorkout = (workout: ActiveWorkout) => {
    setActiveWorkout(workout);
  };

  const endWorkout = () => {
    setActiveWorkout(null);
  };

  const isWorkoutActive = activeWorkout !== null;

  return (
    <WorkoutContext.Provider value={{ activeWorkout, startWorkout, endWorkout, isWorkoutActive }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}