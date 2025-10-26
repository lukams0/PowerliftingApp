import { supabase } from '../lib/supabase';
import { UserRole } from '../types/database.types';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface OnboardingData {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  weightUnit: 'lbs' | 'kg';
  height: number;
  heightUnit: 'in' | 'cm';
  experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  goals: string[];
}

class AuthService {
  /**
   * Sign up a new user
   */
  async signUp({ email, password, fullName, role = 'athlete' }: SignUpData) {
    try {
      console.log('Starting sign up for:', email);
      
      // Create auth user - trigger will create profile automatically
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('User creation failed');
      }

      console.log('User created:', authData.user.id);

      // Wait for trigger to complete (it's very fast but async)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verify profile was created
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        console.log('Profile not found, creating manually...');
        // Fallback: create profile manually if trigger failed
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            full_name: fullName,
            role: role,
          });

        if (insertError && insertError.code !== '23505') {
          console.error('Manual profile creation error:', insertError);
          throw new Error(`Failed to create profile: ${insertError.message}`);
        }
      } else {
        console.log('Profile created by trigger successfully');
      }

      return { user: authData.user, session: authData.session };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn({ email, password }: SignInData) {
    try {
      console.log('Signing in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful');
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get the current session
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Get session error:', error);
        throw error;
      }
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null; // Return null instead of throwing
    }
  }

  /**
   * Get the current user
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'yourapp://reset-password',
      });
      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }

  /**
   * Complete athlete onboarding
   */
  async completeAthleteOnboarding(userId: string, data: OnboardingData) {
    try {
      console.log('Completing athlete onboarding for:', userId);
      
      // Convert units if needed
      const weightLbs = data.weightUnit === 'kg' ? data.weight * 2.20462 : data.weight;
      const heightInches = data.heightUnit === 'cm' ? data.height / 2.54 : data.height;

      const { error } = await supabase.from('athlete_profiles').insert({
        user_id: userId,
        age: data.age,
        gender: data.gender,
        weight_lbs: weightLbs,
        height_inches: heightInches,
        experience_level: data.experience,
        goals: data.goals,
      });

      if (error) {
        console.error('Onboarding insert error:', error);
        throw error;
      }
      
      console.log('Athlete profile created successfully');
    } catch (error) {
      console.error('Complete onboarding error:', error);
      throw error;
    }
  }

  /**
   * Check if user has completed onboarding
   */
  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!profile) return false;

      if (profile.role === 'athlete') {
        const { data } = await supabase
          .from('athlete_profiles')
          .select('id')
          .eq('user_id', userId)
          .single();
        return !!data;
      } else {
        const { data } = await supabase
          .from('coach_profiles')
          .select('id')
          .eq('user_id', userId)
          .single();
        return !!data;
      }
    } catch (error) {
      console.error('Check onboarding error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();