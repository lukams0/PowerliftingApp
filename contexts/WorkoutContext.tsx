import React, { createContext, ReactNode, useContext, useState } from 'react';
import { WorkoutSession, workoutSessionService } from '../services/workoutsession.service';

type ActiveWorkoutContextType = {
  activeSession: WorkoutSession | null;
  sessionId: string | null;
  startTime: number | null;
  isWorkoutActive: boolean;
  startWorkout: (sessionId: string) => Promise<void>;
  endWorkout: () => void;
  loadActiveWorkout: (userId: string) => Promise<void>;
};

const WorkoutContext = createContext<ActiveWorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Start a workout by session ID
  const startWorkout = async (newSessionId: string) => {
    try {
      console.log('Starting workout with session:', newSessionId);
      const session = await workoutSessionService.getSessionDetails(newSessionId);
      if (session) {
        setActiveSession(session);
        setSessionId(newSessionId);
        console.log('Active workout started:', session.name);
      }
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  // End the active workout
  const endWorkout = () => {
    console.log('Ending active workout');
    setActiveSession(null);
    setSessionId(null);
  };

  // Load active workout from database (for resuming)
  const loadActiveWorkout = async (userId: string) => {
    try {
      console.log('Checking for active workout for user:', userId);
      const session = await workoutSessionService.getActiveSession(userId);
      if (session) {
        console.log('Found active workout:', session.name);
        setActiveSession(session);
        setSessionId(session.id);
      } else {
        console.log('No active workout found');
        setActiveSession(null);
        setSessionId(null);
      }
    } catch (error) {
      console.error('Error loading active workout:', error);
    }
  };

  const isWorkoutActive = activeSession !== null;
  const startTime = activeSession ? new Date(activeSession.start_time).getTime() : null;

  return (
    <WorkoutContext.Provider
      value={{
        activeSession,
        sessionId,
        startTime,
        isWorkoutActive,
        startWorkout,
        endWorkout,
        loadActiveWorkout,
      }}
    >
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