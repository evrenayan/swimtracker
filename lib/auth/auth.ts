/**
 * Authentication utilities using Supabase Auth
 */

import { supabase } from '../supabase/client';
import type { UserProfile, UserRole } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  profile: UserProfile | null;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  // Fetch user profile
  const profile = await getUserProfile(data.user.id);

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      profile: profile.data,
    } as AuthUser,
    error: null,
  };
}

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return {
    user: data.user,
    error: null,
  };
}

/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message || null };
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await getUserProfile(user.id);

  return {
    id: user.id,
    email: user.email!,
    profile: profile.data,
  };
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return { data: null, error: error.message };
  }

  return { data: data as UserProfile, error: null };
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as UserProfile, error: null };
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.profile?.role === 'admin';
}

/**
 * Get all user profiles (admin only)
 */
export async function getAllUserProfiles() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as UserProfile[], error: null };
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, role: UserRole) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as UserProfile, error: null };
}

/**
 * Get swimmer linked to current user
 */
export async function getUserSwimmer() {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('swimmers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Check authentication status on client side
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const profile = await getUserProfile(session.user.id);
      callback({
        id: session.user.id,
        email: session.user.email!,
        profile: profile.data,
      });
    } else {
      callback(null);
    }
  });
}
