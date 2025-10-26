import { Session, User } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { authService, OnboardingData, SignInData, SignUpData } from '../services/auth.service';
import { profileService } from '../services/profile.service';
import { Profile } from '../types/database.types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Timeout for profile loading (10 seconds)
const PROFILE_LOAD_TIMEOUT = 10000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const session = await authService.getSession();
        console.log('Session retrieved:', !!session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('Loading profile for user:', session.user.id);
          await loadProfile(session.user.id);
        } else {
          console.log('No session found, setting loading to false');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        console.log('Auth initialization complete, setting loading to false');
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('Loading profile after auth change for user:', session.user.id);
          await loadProfile(session.user.id);
        } else {
          console.log('No user after auth change, clearing profile');
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Profile load timeout')), PROFILE_LOAD_TIMEOUT);
    });

    try {
      console.log('Loading profile for:', userId);
      
      // Race between the actual load and the timeout
      const userProfile = await Promise.race([
        profileService.getProfile(userId),
        timeoutPromise
      ]) as Profile | null;
      
      console.log('Profile loaded:', !!userProfile);
      
      if (!userProfile) {
        console.warn('⚠️ Profile not found for user:', userId);
        console.log('This is normal during initial signup or if profile was deleted');
        setProfile(null);
        return;
      }
      
      setProfile(userProfile);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      
      // If it's a timeout, log it specifically
      if (error.message === 'Profile load timeout') {
        console.error('❌ Profile load timed out after', PROFILE_LOAD_TIMEOUT / 1000, 'seconds');
      }
      
      console.log('Setting profile to null and continuing...');
      setProfile(null);
      // Don't throw - allow the app to continue even if profile load fails
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true);
      console.log('Starting sign up...');
      const { user: newUser, session: newSession } = await authService.signUp(data);
      
      if (newUser && newSession) {
        // Manually set the session and user immediately
        setSession(newSession);
        setUser(newUser);
        
        console.log('Sign up complete, waiting for session to persist...');
        // Give the session a moment to persist
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load profile
        console.log('Loading profile after sign up...');
        await loadProfile(newUser.id);
        
        console.log('Sign up complete, session set');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: SignInData) => {
    try {
      setLoading(true);
      console.log('Starting sign in...');
      const { user: signedInUser } = await authService.signIn(data);
      
      if (signedInUser) {
        console.log('Sign in successful, loading profile...');
        await loadProfile(signedInUser.id);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out...');
      await authService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      console.log('Sign out complete');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (data: OnboardingData) => {
    try {
      setLoading(true);
      console.log('Starting onboarding...');
      
      // Try to get user from context first, then from Supabase
      let currentUser = user;
      
      if (!currentUser) {
        console.log('User not in context, fetching from Supabase...');
        const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !fetchedUser) {
          console.error('Error getting user:', userError);
          throw new Error('No user found. Please sign in again.');
        }
        
        currentUser = fetchedUser;
        setUser(currentUser); // Update context
      }
      
      console.log('Completing onboarding for user:', currentUser.id);
      
      await authService.completeAthleteOnboarding(currentUser.id, data);
      
      console.log('Onboarding complete, loading profile...');
      await loadProfile(currentUser.id);
      
      console.log('Onboarding completed successfully');
    } catch (error) {
      console.error('Complete onboarding error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log('Refreshing profile...');
      await loadProfile(user.id);
    } else {
      console.log('Cannot refresh profile - no user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        completeOnboarding,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}