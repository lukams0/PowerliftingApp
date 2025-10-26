import { supabase } from '../lib/supabase';

// Types for workout sessions
export interface WorkoutSession {
  id: string;
  athlete_id: string;
  workout_template_id: string | null;
  name: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  total_volume_lbs: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionExercise {
  id: string;
  session_id: string;
  exercise_id: string;
  exercise_order: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExerciseSet {
  id: string;
  session_exercise_id: string;
  set_number: number;
  weight_lbs: number;
  reps: number;
  rpe: number | null;
  completed: boolean;
  created_at: string;
}

export interface WorkoutSessionWithDetails extends WorkoutSession {
  exercises: (SessionExercise & {
    exercise: {
      id: string;
      name: string;
      category: string;
    };
    sets: ExerciseSet[];
  })[];
}

class WorkoutSessionService {
  /**
   * Create a new workout session
   */
  async createSession(
    athleteId: string,
    data: {
      name: string;
      workout_template_id?: string;
      notes?: string;
    }
  ): Promise<WorkoutSession> {
    try {
      console.log('Creating workout session:', data.name);
      
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert({
          athlete_id: athleteId,
          workout_template_id: data.workout_template_id || null,
          name: data.name,
          start_time: new Date().toISOString(),
          notes: data.notes,
        })
        .select()
        .single();

      if (error) {
        console.error('Create session error:', error);
        throw error;
      }

      console.log('Workout session created successfully');
      return session;
    } catch (error) {
      console.error('Create session error:', error);
      throw error;
    }
  }

  /**
   * Get all workout sessions for an athlete
   */
  async getAthleteSessions(athleteId: string): Promise<WorkoutSession[]> {
    try {
      console.log('Fetching sessions for athlete:', athleteId);
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('athlete_id', athleteId)
        .order('start_time', { ascending: false });

      if (error) {
        console.error('Fetch sessions error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} sessions`);
      return data || [];
    } catch (error) {
      console.error('Get athlete sessions error:', error);
      throw error;
    }
  }

  /**
   * Get a single workout session with all details (exercises and sets)
   */
  async getSessionDetails(sessionId: string): Promise<WorkoutSessionWithDetails | null> {
    try {
      console.log('Fetching session details:', sessionId);
      
      // Get the session
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) {
        console.error('Fetch session error:', sessionError);
        throw sessionError;
      }

      // Get exercises with details
      const { data: exercises, error: exercisesError } = await supabase
        .from('session_exercises')
        .select(`
          *,
          exercise:exercises(id, name, category)
        `)
        .eq('session_id', sessionId)
        .order('exercise_order');

      if (exercisesError) {
        console.error('Fetch exercises error:', exercisesError);
        throw exercisesError;
      }

      // Get sets for each exercise
      const exercisesWithSets = await Promise.all(
        (exercises || []).map(async (exercise) => {
          const { data: sets, error: setsError } = await supabase
            .from('exercise_sets')
            .select('*')
            .eq('session_exercise_id', exercise.id)
            .order('set_number');

          if (setsError) {
            console.error('Fetch sets error:', setsError);
            throw setsError;
          }

          return {
            ...exercise,
            sets: sets || [],
          };
        })
      );

      console.log('Session details fetched successfully');
      return {
        ...session,
        exercises: exercisesWithSets,
      };
    } catch (error) {
      console.error('Get session details error:', error);
      throw error;
    }
  }

  /**
   * Add an exercise to a workout session
   */
  async addExerciseToSession(
    sessionId: string,
    exerciseId: string,
    order: number,
    notes?: string
  ): Promise<SessionExercise> {
    try {
      console.log('Adding exercise to session:', exerciseId);
      
      const { data, error } = await supabase
        .from('session_exercises')
        .insert({
          session_id: sessionId,
          exercise_id: exerciseId,
          exercise_order: order,
          notes: notes,
        })
        .select()
        .single();

      if (error) {
        console.error('Add exercise error:', error);
        throw error;
      }

      console.log('Exercise added to session successfully');
      return data;
    } catch (error) {
      console.error('Add exercise to session error:', error);
      throw error;
    }
  }

  /**
   * Add a set to a session exercise
   */
  async addSetToExercise(
    sessionExerciseId: string,
    setData: {
      set_number: number;
      weight_lbs: number;
      reps: number;
      rpe?: number;
      completed?: boolean;
    }
  ): Promise<ExerciseSet> {
    try {
      console.log('Adding set to exercise:', sessionExerciseId);
      
      const { data, error } = await supabase
        .from('exercise_sets')
        .insert({
          session_exercise_id: sessionExerciseId,
          set_number: setData.set_number,
          weight_lbs: setData.weight_lbs,
          reps: setData.reps,
          rpe: setData.rpe || null,
          completed: setData.completed !== undefined ? setData.completed : true,
        })
        .select()
        .single();

      if (error) {
        console.error('Add set error:', error);
        throw error;
      }

      console.log('Set added successfully');
      return data;
    } catch (error) {
      console.error('Add set to exercise error:', error);
      throw error;
    }
  }

  /**
   * Update a set
   */
  async updateSet(
    setId: string,
    updates: {
      weight_lbs?: number;
      reps?: number;
      rpe?: number;
      completed?: boolean;
    }
  ): Promise<ExerciseSet> {
    try {
      console.log('Updating set:', setId);
      
      const { data, error } = await supabase
        .from('exercise_sets')
        .update(updates)
        .eq('id', setId)
        .select()
        .single();

      if (error) {
        console.error('Update set error:', error);
        throw error;
      }

      console.log('Set updated successfully');
      return data;
    } catch (error) {
      console.error('Update set error:', error);
      throw error;
    }
  }

  /**
   * Delete a set
   */
  async deleteSet(setId: string): Promise<void> {
    try {
      console.log('Deleting set:', setId);
      
      const { error } = await supabase
        .from('exercise_sets')
        .delete()
        .eq('id', setId);

      if (error) {
        console.error('Delete set error:', error);
        throw error;
      }

      console.log('Set deleted successfully');
    } catch (error) {
      console.error('Delete set error:', error);
      throw error;
    }
  }

  /**
   * Complete a workout session
   */
  async completeSession(
    sessionId: string,
    notes?: string
  ): Promise<WorkoutSession> {
    try {
      console.log('Completing session:', sessionId);
      
      const endTime = new Date().toISOString();
      
      // Get session start time
      const { data: session } = await supabase
        .from('workout_sessions')
        .select('start_time')
        .eq('id', sessionId)
        .single();

      if (!session) {
        throw new Error('Session not found');
      }

      // Calculate duration
      const startTime = new Date(session.start_time);
      const durationMinutes = Math.round(
        (new Date(endTime).getTime() - startTime.getTime()) / 60000
      );

      // Calculate total volume - First get session exercise IDs
      const { data: sessionExercises } = await supabase
        .from('session_exercises')
        .select('id')
        .eq('session_id', sessionId);

      const sessionExerciseIds = (sessionExercises || []).map(se => se.id);

      // Then get all sets for those exercises
      let totalVolume = 0;
      if (sessionExerciseIds.length > 0) {
        const { data: sets } = await supabase
          .from('exercise_sets')
          .select('weight_lbs, reps')
          .in('session_exercise_id', sessionExerciseIds);

        totalVolume = (sets || []).reduce(
          (sum, set) => sum + set.weight_lbs * set.reps,
          0
        );
      }

      // Update session
      const { data, error } = await supabase
        .from('workout_sessions')
        .update({
          end_time: endTime,
          duration_minutes: durationMinutes,
          total_volume_lbs: totalVolume,
          notes: notes,
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) {
        console.error('Complete session error:', error);
        throw error;
      }

      console.log('Session completed successfully');
      return data;
    } catch (error) {
      console.error('Complete session error:', error);
      throw error;
    }
  }

  /**
   * Delete a workout session
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      console.log('Deleting session:', sessionId);
      
      const { error } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Delete session error:', error);
        throw error;
      }

      console.log('Session deleted successfully');
    } catch (error) {
      console.error('Delete session error:', error);
      throw error;
    }
  }

  /**
   * Get workout statistics for an athlete
   */
  async getAthleteStats(athleteId: string): Promise<{
    totalWorkouts: number;
    totalVolume: number;
    averageDuration: number;
    thisWeekWorkouts: number;
  }> {
    try {
      console.log('Fetching athlete stats:', athleteId);
      
      const { data: sessions, error } = await supabase
        .from('workout_sessions')
        .select('duration_minutes, total_volume_lbs, start_time')
        .eq('athlete_id', athleteId)
        .not('end_time', 'is', null);

      if (error) {
        console.error('Fetch stats error:', error);
        throw error;
      }

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalWorkouts = sessions?.length || 0;
      const totalVolume = sessions?.reduce((sum, s) => sum + (s.total_volume_lbs || 0), 0) || 0;
      const averageDuration = totalWorkouts > 0
        ? sessions!.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / totalWorkouts
        : 0;
      const thisWeekWorkouts = sessions?.filter(
        s => new Date(s.start_time) >= oneWeekAgo
      ).length || 0;

      return {
        totalWorkouts,
        totalVolume,
        averageDuration: Math.round(averageDuration),
        thisWeekWorkouts,
      };
    } catch (error) {
      console.error('Get athlete stats error:', error);
      throw error;
    }
  }
}

export const workoutSessionService = new WorkoutSessionService();