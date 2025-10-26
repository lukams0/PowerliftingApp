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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    authService.getSession().then((session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const userProfile = await profileService.getProfile(userId);
      setProfile(userProfile);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      // If profile doesn't exist (PGRST116), that's okay during signup
      // The profile will be created by the signup process
      if (error?.code !== 'PGRST116') {
        console.error('Unexpected profile error:', error);
      }
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true);
      const { user: newUser, session: newSession } = await authService.signUp(data);
      
      if (newUser && newSession) {
        // Manually set the session and user immediately
        setSession(newSession);
        setUser(newUser);
        
        // Give the session a moment to persist
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load profile
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
      const { user: signedInUser } = await authService.signIn(data);
      if (signedInUser) {
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
      await authService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
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
      await loadProfile(user.id);
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