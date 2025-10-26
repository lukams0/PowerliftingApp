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

  // Use refs to track state that needs to be accessed from callbacks
  const initCompleteRef = React.useRef(false);
  const loadProfilePromiseRef = React.useRef<Promise<void> | null>(null);

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
        initCompleteRef.current = true;
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        console.log('Session exists:', !!session);
        console.log('User ID:', session?.user?.id);

        // During initialization, skip all events to avoid duplicate loads
        if (!initCompleteRef.current) {
          console.log('Skipping event during initialization:', event);
          return;
        }

        console.log('Auth state changed:', event);

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user && event === 'SIGNED_IN') {
          console.log('Loading profile after sign in for user:', session.user.id);
          await loadProfile(session.user.id);
        } else if (!session?.user) {
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
    // If there's already a profile load in progress, wait for it
    if (loadProfilePromiseRef.current) {
      console.log('Profile load already in progress, waiting...');
      await loadProfilePromiseRef.current;
      return;
    }

    // Create a new promise for this load
    const loadPromise = (async () => {
      try {
        console.log('Starting profile load for user:', userId);
        const userProfile = await profileService.getProfile(userId);
        setProfile(userProfile ?? null);
        console.log('Profile load completed successfully');
      } catch (err: any) {
        console.error('Error loading profile:', err);
        setProfile(null);
      } finally {
        // Clear the promise reference when done
        loadProfilePromiseRef.current = null;
      }
    })();

    // Store the promise so concurrent calls can wait for it
    loadProfilePromiseRef.current = loadPromise;
    await loadPromise;
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