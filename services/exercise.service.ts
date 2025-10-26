import { supabase } from '../lib/supabase';
import { Exercise, ExerciseCategory } from '../types/database.types';

class ExerciseService {
  /**
   * Get all exercises (system + user's custom exercises)
   */
  async getAllExercises(userId?: string): Promise<Exercise[]> {
    try {
      console.log('Fetching all exercises');
      
      let query = supabase
        .from('exercises')
        .select('*')
        .order('name');

      const { data, error } = await query;

      if (error) {
        console.error('Fetch exercises error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} exercises`);
      return data || [];
    } catch (error) {
      console.error('Get all exercises error:', error);
      throw error;
    }
  }

  /**
   * Get exercises by category
   */
  async getExercisesByCategory(category: ExerciseCategory, userId?: string): Promise<Exercise[]> {
    try {
      console.log('Fetching exercises for category:', category);
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('category', category)
        .order('name');

      if (error) {
        console.error('Fetch exercises by category error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} exercises for category ${category}`);
      return data || [];
    } catch (error) {
      console.error('Get exercises by category error:', error);
      throw error;
    }
  }

  /**
   * Get a single exercise by ID
   */
  async getExercise(exerciseId: string): Promise<Exercise | null> {
    try {
      console.log('Fetching exercise:', exerciseId);
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', exerciseId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Exercise not found');
          return null;
        }
        console.error('Fetch exercise error:', error);
        throw error;
      }

      console.log('Exercise fetched successfully');
      return data;
    } catch (error) {
      console.error('Get exercise error:', error);
      throw error;
    }
  }

  /**
   * Search exercises by name
   */
  async searchExercises(searchTerm: string, userId?: string): Promise<Exercise[]> {
    try {
      console.log('Searching exercises:', searchTerm);
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('name');

      if (error) {
        console.error('Search exercises error:', error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} exercises matching "${searchTerm}"`);
      return data || [];
    } catch (error) {
      console.error('Search exercises error:', error);
      throw error;
    }
  }

  /**
   * Create a custom exercise
   */
  async createCustomExercise(
    userId: string,
    exercise: {
      name: string;
      category: ExerciseCategory;
      description?: string;
      form_notes?: string;
      video_url?: string;
    }
  ): Promise<Exercise> {
    try {
      console.log('Creating custom exercise:', exercise.name);
      
      const { data, error } = await supabase
        .from('exercises')
        .insert({
          ...exercise,
          created_by: userId,
          is_custom: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Create exercise error:', error);
        throw error;
      }

      console.log('Custom exercise created successfully');
      return data;
    } catch (error) {
      console.error('Create custom exercise error:', error);
      throw error;
    }
  }

  /**
   * Update a custom exercise
   */
  async updateCustomExercise(
    exerciseId: string,
    updates: {
      name?: string;
      category?: ExerciseCategory;
      description?: string;
      form_notes?: string;
      video_url?: string;
    }
  ): Promise<Exercise> {
    try {
      console.log('Updating custom exercise:', exerciseId);
      
      const { data, error } = await supabase
        .from('exercises')
        .update(updates)
        .eq('id', exerciseId)
        .eq('is_custom', true) // Only allow updating custom exercises
        .select()
        .single();

      if (error) {
        console.error('Update exercise error:', error);
        throw error;
      }

      console.log('Custom exercise updated successfully');
      return data;
    } catch (error) {
      console.error('Update custom exercise error:', error);
      throw error;
    }
  }

  /**
   * Delete a custom exercise
   */
  async deleteCustomExercise(exerciseId: string): Promise<void> {
    try {
      console.log('Deleting custom exercise:', exerciseId);
      
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId)
        .eq('is_custom', true); // Only allow deleting custom exercises

      if (error) {
        console.error('Delete exercise error:', error);
        throw error;
      }

      console.log('Custom exercise deleted successfully');
    } catch (error) {
      console.error('Delete custom exercise error:', error);
      throw error;
    }
  }

  /**
   * Get user's custom exercises
   */
  async getCustomExercises(userId: string): Promise<Exercise[]> {
    try {
      console.log('Fetching custom exercises for user:', userId);
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('created_by', userId)
        .eq('is_custom', true)
        .order('name');

      if (error) {
        console.error('Fetch custom exercises error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} custom exercises`);
      return data || [];
    } catch (error) {
      console.error('Get custom exercises error:', error);
      throw error;
    }
  }
}

export const exerciseService = new ExerciseService();