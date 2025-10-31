import { supabase } from '../lib/supabase';

// Types for programs
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ProgramStatus = 'active' | 'completed' | 'paused';

export interface Program {
  id: string;
  name: string;
  description: string | null;
  coach_id: string;
  duration_weeks: number;
  difficulty_level: DifficultyLevel | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramBlock {
  id: string;
  program_id: string;
  name: string;
  description: string | null;
  start_week: number;
  end_week: number;
  focus: string | null;
  block_order: number;
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: string;
  program_block_id: string | null;
  name: string;
  description: string | null;
  week_number: number | null;
  day_of_week: string | null;
  estimated_duration_minutes: number | null;
  created_by: string | null;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise_order: number;
  target_sets: number;
  target_reps: string;
  target_weight_lbs: number | null;
  target_rpe: string | null;
  rest_seconds: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AthleteProgram {
  id: string;
  athlete_id: string;
  program_id: string;
  start_date: string;
  end_date: string | null;
  current_week: number;
  status: ProgramStatus;
  created_at: string;
  updated_at: string;
}

export interface ProgramWithDetails extends Program {
  blocks: (ProgramBlock & {
    workouts: Workout[];
  })[];
}

class ProgramService {
  /**
   * Get all public programs
   */
  async getPublicPrograms(): Promise<Program[]> {
    try {
      console.log('Fetching public programs');
      
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch public programs error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} public programs`);
      return data || [];
    } catch (error) {
      console.error('Get public programs error:', error);
      throw error;
    }
  }

  /**
   * Get programs created by a coach
   */
  async getCoachPrograms(coachId: string): Promise<Program[]> {
    try {
      console.log('Fetching programs for coach:', coachId);
      
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('coach_id', coachId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch coach programs error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} coach programs`);
      return data || [];
    } catch (error) {
      console.error('Get coach programs error:', error);
      throw error;
    }
  }

  /**
   * Get programs an athlete is enrolled in
   */
  async getAthletePrograms(athleteId: string): Promise<(AthleteProgram & { program: Program })[]> {
    try {
      console.log('Fetching programs for athlete:', athleteId);
      
      const { data, error } = await supabase
        .from('athlete_programs')
        .select(`
          *,
          program:programs(*)
        `)
        .eq('athlete_id', athleteId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch athlete programs error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} athlete programs`);
      return data as (AthleteProgram & { program: Program })[] || [];
    } catch (error) {
      console.error('Get athlete programs error:', error);
      throw error;
    }
  }

  /**
   * Get a single program with all details (blocks and workouts)
   */
  async getProgramDetails(programId: string): Promise<ProgramWithDetails | null> {
    try {
      console.log('Fetching program details:', programId);

      // Get the program
      const { data: program, error: programError } = await supabase
        .from('programs')
        .select('*')
        .eq('id', programId)
        .single();

      if (programError) {
        console.error('Fetch program error:', programError);
        throw programError;
      }

      // Get blocks with workouts
      const { data: blocks, error: blocksError } = await supabase
        .from('program_blocks')
        .select(`
          *,
          workouts:workouts(*)
        `)
        .eq('program_id', programId)
        .order('block_order');

      if (blocksError) {
        console.error('Fetch blocks error:', blocksError);
        throw blocksError;
      }

      console.log('Program details fetched successfully');
      return {
        ...program,
        blocks: blocks || [],
      };
    } catch (error) {
      console.error('Get program details error:', error);
      throw error;
    }
  }

  /**
   * Get a single program block with workouts
   */
  async getBlockDetails(blockId: string): Promise<(ProgramBlock & {
    workouts: Workout[];
    program: Program;
  }) | null> {
    try {
      console.log('Fetching block details:', blockId);

      const { data, error } = await supabase
        .from('program_blocks')
        .select(`
          *,
          workouts:workouts(*),
          program:programs(*)
        `)
        .eq('id', blockId)
        .single();

      if (error) {
        console.error('Fetch block error:', error);
        throw error;
      }

      console.log('Block details fetched successfully');
      return data as (ProgramBlock & { workouts: Workout[]; program: Program });
    } catch (error) {
      console.error('Get block details error:', error);
      throw error;
    }
  }

  /**
   * Get a single workout with exercises
   */
  async getWorkoutDetails(workoutId: string): Promise<(Workout & {
    exercises: (WorkoutExercise & {
      exercise: {
        id: string;
        name: string;
        category: string;
      };
    })[];
  }) | null> {
    try {
      console.log('Fetching workout details:', workoutId);
      
      // Get the workout
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', workoutId)
        .single();

      if (workoutError) {
        console.error('Fetch workout error:', workoutError);
        throw workoutError;
      }

      // Get exercises with details
      const { data: exercises, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select(`
          *,
          exercise:exercises(id, name, category)
        `)
        .eq('workout_id', workoutId)
        .order('exercise_order');

      if (exercisesError) {
        console.error('Fetch exercises error:', exercisesError);
        throw exercisesError;
      }

      console.log('Workout details fetched successfully');
      return {
        ...workout,
        exercises: exercises || [],
      };
    } catch (error) {
      console.error('Get workout details error:', error);
      throw error;
    }
  }

  /**
   * Create a new program
   */
  async createProgram(
    coachId: string,
    data: {
      name: string;
      description?: string;
      duration_weeks: number;
      difficulty_level?: DifficultyLevel;
      is_public?: boolean;
    }
  ): Promise<Program> {
    try {
      console.log('Creating program:', data.name);
      
      const { data: program, error } = await supabase
        .from('programs')
        .insert({
          coach_id: coachId,
          name: data.name,
          description: data.description || null,
          duration_weeks: data.duration_weeks,
          difficulty_level: data.difficulty_level || null,
          is_public: data.is_public || false,
        })
        .select()
        .single();

      if (error) {
        console.error('Create program error:', error);
        throw error;
      }

      console.log('Program created successfully');
      return program;
    } catch (error) {
      console.error('Create program error:', error);
      throw error;
    }
  }

  /**
   * Create a program block
   */
  async createProgramBlock(
    programId: string,
    data: {
      name: string;
      description?: string;
      start_week: number;
      end_week: number;
      focus?: string;
      block_order: number;
    }
  ): Promise<ProgramBlock> {
    try {
      console.log('Creating program block:', data.name);
      
      const { data: block, error } = await supabase
        .from('program_blocks')
        .insert({
          program_id: programId,
          name: data.name,
          description: data.description || null,
          start_week: data.start_week,
          end_week: data.end_week,
          focus: data.focus || null,
          block_order: data.block_order,
        })
        .select()
        .single();

      if (error) {
        console.error('Create program block error:', error);
        throw error;
      }

      console.log('Program block created successfully');
      return block;
    } catch (error) {
      console.error('Create program block error:', error);
      throw error;
    }
  }

  /**
   * Create a workout
   */
  async createWorkout(
    data: {
      program_block_id?: string;
      name: string;
      description?: string;
      week_number?: number;
      day_of_week?: string;
      estimated_duration_minutes?: number;
      created_by?: string;
      is_template?: boolean;
    }
  ): Promise<Workout> {
    try {
      console.log('Creating workout:', data.name);
      
      const { data: workout, error } = await supabase
        .from('workouts')
        .insert({
          program_block_id: data.program_block_id || null,
          name: data.name,
          description: data.description || null,
          week_number: data.week_number || null,
          day_of_week: data.day_of_week || null,
          estimated_duration_minutes: data.estimated_duration_minutes || null,
          created_by: data.created_by || null,
          is_template: data.is_template !== undefined ? data.is_template : true,
        })
        .select()
        .single();

      if (error) {
        console.error('Create workout error:', error);
        throw error;
      }

      console.log('Workout created successfully');
      return workout;
    } catch (error) {
      console.error('Create workout error:', error);
      throw error;
    }
  }

  /**
   * Add an exercise to a workout
   */
  async addExerciseToWorkout(
    workoutId: string,
    data: {
      exercise_id: string;
      exercise_order: number;
      target_sets: number;
      target_reps: string;
      target_weight_lbs?: number;
      target_rpe?: string;
      rest_seconds?: number;
      notes?: string;
    }
  ): Promise<WorkoutExercise> {
    try {
      console.log('Adding exercise to workout:', workoutId);
      
      const { data: workoutExercise, error } = await supabase
        .from('workout_exercises')
        .insert({
          workout_id: workoutId,
          exercise_id: data.exercise_id,
          exercise_order: data.exercise_order,
          target_sets: data.target_sets,
          target_reps: data.target_reps,
          target_weight_lbs: data.target_weight_lbs || null,
          target_rpe: data.target_rpe || null,
          rest_seconds: data.rest_seconds || null,
          notes: data.notes || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Add exercise to workout error:', error);
        throw error;
      }

      console.log('Exercise added to workout successfully');
      return workoutExercise;
    } catch (error) {
      console.error('Add exercise to workout error:', error);
      throw error;
    }
  }

  /**
   * Enroll an athlete in a program
   */
  async enrollAthlete(
    athleteId: string,
    programId: string,
    startDate?: string
  ): Promise<AthleteProgram> {
    try {
      console.log('Enrolling athlete in program:', programId);
      
      const { data, error } = await supabase
        .from('athlete_programs')
        .insert({
          athlete_id: athleteId,
          program_id: programId,
          start_date: startDate || new Date().toISOString().split('T')[0],
          current_week: 1,
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        console.error('Enroll athlete error:', error);
        throw error;
      }

      console.log('Athlete enrolled successfully');
      return data;
    } catch (error) {
      console.error('Enroll athlete error:', error);
      throw error;
    }
  }

  /**
   * Update athlete program progress
   */
  async updateAthleteProgress(
    athleteProgramId: string,
    data: {
      current_week?: number;
      status?: ProgramStatus;
      end_date?: string;
    }
  ): Promise<AthleteProgram> {
    try {
      console.log('Updating athlete program:', athleteProgramId);
      
      const { data: athleteProgram, error } = await supabase
        .from('athlete_programs')
        .update(data)
        .eq('id', athleteProgramId)
        .select()
        .single();

      if (error) {
        console.error('Update athlete progress error:', error);
        throw error;
      }

      console.log('Athlete program updated successfully');
      return athleteProgram;
    } catch (error) {
      console.error('Update athlete progress error:', error);
      throw error;
    }
  }

  /**
   * Get workouts for a specific week in a program
   */
  async getWeekWorkouts(
    programId: string,
    weekNumber: number
  ): Promise<Workout[]> {
    try {
      console.log('Fetching workouts for week:', weekNumber);
      
      // First get the blocks for this program
      const { data: blocks, error: blocksError } = await supabase
        .from('program_blocks')
        .select('id')
        .eq('program_id', programId)
        .lte('start_week', weekNumber)
        .gte('end_week', weekNumber);

      if (blocksError) {
        console.error('Fetch blocks error:', blocksError);
        throw blocksError;
      }

      if (!blocks || blocks.length === 0) {
        return [];
      }

      const blockIds = blocks.map(b => b.id);

      // Get workouts for these blocks and this week
      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .in('program_block_id', blockIds)
        .eq('week_number', weekNumber)
        .order('day_of_week');

      if (workoutsError) {
        console.error('Fetch workouts error:', workoutsError);
        throw workoutsError;
      }

      console.log(`Fetched ${workouts?.length || 0} workouts for week ${weekNumber}`);
      return workouts || [];
    } catch (error) {
      console.error('Get week workouts error:', error);
      throw error;
    }
  }

  /**
   * Get athlete's active program
   */
  async getActiveProgram(athleteId: string): Promise<(AthleteProgram & { program: Program }) | null> {
    try {
      console.log('Fetching active program for athlete:', athleteId);
      
      const { data, error } = await supabase
        .from('athlete_programs')
        .select(`
          *,
          program:programs(*)
        `)
        .eq('athlete_id', athleteId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Fetch active program error:', error);
        throw error;
      }

      return data as (AthleteProgram & { program: Program }) | null;
    } catch (error) {
      console.error('Get active program error:', error);
      throw error;
    }
  }

  /**
   * Delete a program (coaches only)
   */
  async deleteProgram(programId: string): Promise<void> {
    try {
      console.log('Deleting program:', programId);
      
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);

      if (error) {
        console.error('Delete program error:', error);
        throw error;
      }

      console.log('Program deleted successfully');
    } catch (error) {
      console.error('Delete program error:', error);
      throw error;
    }
  }
}

export const programService = new ProgramService();