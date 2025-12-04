import { supabase } from './client';
import type {
  Swimmer,
  RaceRecord,
  PoolType,
  SwimmingStyle,
  BarrierType,
  BarrierValue,
  UserProfile,
} from '../types';

// ============================================================================
// Error Handling Utility
// ============================================================================

interface QueryResult<T> {
  data: T | null;
  error: Error | null;
}

function handleSupabaseError<T>(
  data: T | null,
  error: any
): QueryResult<T> {
  if (error) {
    console.error('Supabase query error:', error);
    return {
      data: null,
      error: new Error(error.message || 'Database operation failed'),
    };
  }
  return { data, error: null };
}

// ============================================================================
// Swimmer Queries
// ============================================================================

export async function createSwimmer(
  swimmer: Omit<Swimmer, 'id' | 'created_at'>
): Promise<QueryResult<Swimmer>> {
  const { data, error } = await supabase
    .from('swimmers')
    .insert([swimmer])
    .select()
    .single();

  return handleSupabaseError(data, error);
}

export async function getSwimmer(id: string): Promise<QueryResult<Swimmer>> {
  const { data, error } = await supabase
    .from('swimmers')
    .select('*')
    .eq('id', id)
    .single();

  return handleSupabaseError(data, error);
}

export async function getAllSwimmers(): Promise<QueryResult<Swimmer[]>> {
  const { data, error } = await supabase
    .from('swimmers')
    .select('*')
    .order('created_at', { ascending: false });

  return handleSupabaseError(data || [], error);
}

export async function updateSwimmer(
  id: string,
  updates: Partial<Omit<Swimmer, 'id' | 'created_at'>>
): Promise<QueryResult<Swimmer>> {
  const { data, error } = await supabase
    .from('swimmers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseError(data, error);
}

export async function deleteSwimmer(id: string): Promise<QueryResult<void>> {
  const { error } = await supabase
    .from('swimmers')
    .delete()
    .eq('id', id);

  return handleSupabaseError(null, error);
}

// ============================================================================
// Race Record Queries
// ============================================================================

export async function createRaceRecord(
  record: Omit<RaceRecord, 'id' | 'created_at'>
): Promise<QueryResult<RaceRecord>> {
  const { data, error } = await supabase
    .from('race_records')
    .insert([record])
    .select()
    .single();

  return handleSupabaseError(data, error);
}

export async function getRaceRecord(
  id: string
): Promise<QueryResult<RaceRecord>> {
  const { data, error } = await supabase
    .from('race_records')
    .select('*')
    .eq('id', id)
    .single();

  return handleSupabaseError(data, error);
}

export async function getRaceRecordsBySwimmer(
  swimmerId: string
): Promise<QueryResult<RaceRecord[]>> {
  const { data, error } = await supabase
    .from('race_records')
    .select('*')
    .eq('swimmer_id', swimmerId)
    .order('year', { ascending: false })
    .order('month', { ascending: false });

  return handleSupabaseError(data || [], error);
}

export async function getRaceRecordsBySwimmerAndStyle(
  swimmerId: string,
  poolType: string,
  swimmingStyle: string
): Promise<QueryResult<RaceRecord[]>> {
  const { data, error } = await supabase
    .from('race_records')
    .select('*')
    .eq('swimmer_id', swimmerId)
    .eq('pool_type', poolType)
    .eq('swimming_style', swimmingStyle)
    .order('year', { ascending: true })
    .order('month', { ascending: true });

  return handleSupabaseError(data || [], error);
}

export async function updateRaceRecord(
  id: string,
  updates: Partial<Omit<RaceRecord, 'id' | 'swimmer_id' | 'created_at'>>
): Promise<QueryResult<RaceRecord>> {
  const { data, error } = await supabase
    .from('race_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseError(data, error);
}

export async function deleteRaceRecord(id: string): Promise<QueryResult<void>> {
  const { error } = await supabase
    .from('race_records')
    .delete()
    .eq('id', id);

  return handleSupabaseError(null, error);
}

// ============================================================================
// Reference Data Queries
// ============================================================================

export async function getAllPoolTypes(): Promise<QueryResult<PoolType[]>> {
  const { data, error } = await supabase
    .from('pool_types')
    .select('*')
    .order('length_meters', { ascending: true });

  return handleSupabaseError(data || [], error);
}

export async function getAllSwimmingStyles(): Promise<
  QueryResult<SwimmingStyle[]>
> {
  const { data, error } = await supabase
    .from('swimming_styles')
    .select('*')
    .order('distance_meters', { ascending: true });

  return handleSupabaseError(data || [], error);
}

export async function getAllBarrierTypes(): Promise<QueryResult<BarrierType[]>> {
  const { data, error } = await supabase
    .from('barrier_types')
    .select('*')
    .order('name', { ascending: true });

  return handleSupabaseError(data || [], error);
}

export async function getBarrierValues(
  age: number,
  gender: string,
  poolTypeId: string,
  swimmingStyleId: string
): Promise<QueryResult<BarrierValue[]>> {
  const { data, error } = await supabase
    .from('barrier_values')
    .select('*')
    .eq('age', age)
    .eq('gender', gender)
    .eq('pool_type_id', poolTypeId)
    .eq('swimming_style_id', swimmingStyleId);

  return handleSupabaseError(data || [], error);
}

export async function getAllBarrierValues(): Promise<
  QueryResult<BarrierValue[]>
> {
  const { data, error } = await supabase
    .from('barrier_values')
    .select('*');

  return handleSupabaseError(data || [], error);
}

// ============================================================================
// Helper Queries
// ============================================================================

export async function getBestTimeForStyle(
  swimmerId: string,
  poolType: string,
  swimmingStyle: string
): Promise<QueryResult<RaceRecord | null>> {
  const { data, error } = await supabase
    .from('race_records')
    .select('*')
    .eq('swimmer_id', swimmerId)
    .eq('pool_type', poolType)
    .eq('swimming_style', swimmingStyle)
    .order('total_milliseconds', { ascending: true })
    .limit(1)
    .maybeSingle();

  return handleSupabaseError(data, error);
}

export async function getSwimmerWithRaceCount(
  id: string
): Promise<QueryResult<{ swimmer: Swimmer; raceCount: number } | null>> {
  const swimmerResult = await getSwimmer(id);

  if (swimmerResult.error || !swimmerResult.data) {
    return { data: null, error: swimmerResult.error };
  }

  const { count, error } = await supabase
    .from('race_records')
    .select('*', { count: 'exact', head: true })
    .eq('swimmer_id', id);

  if (error) {
    return handleSupabaseError(null, error);
  }

  return {
    data: {
      swimmer: swimmerResult.data,
      raceCount: count || 0,
    },
    error: null,
  };
}

// ============================================================================
// Barrier Value Management Queries
// ============================================================================

export async function createBarrierValue(
  barrierValue: Omit<BarrierValue, 'id' | 'created_at'>
): Promise<QueryResult<BarrierValue>> {
  const { data, error } = await supabase
    .from('barrier_values')
    .insert([barrierValue])
    .select()
    .single();

  return handleSupabaseError(data, error);
}

export async function updateBarrierValue(
  id: string,
  updates: Partial<Omit<BarrierValue, 'id' | 'created_at'>>
): Promise<QueryResult<BarrierValue>> {
  const { data, error } = await supabase
    .from('barrier_values')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseError(data, error);
}

export async function deleteBarrierValue(id: string): Promise<QueryResult<void>> {
  const { data, error } = await supabase
    .from('barrier_values')
    .delete()
    .eq('id', id)
    .select();

  if (!error && (!data || data.length === 0)) {
    return {
      data: null,
      error: new Error('Silme işlemi başarısız oldu. Yetkiniz olmayabilir.'),
    };
  }

  return handleSupabaseError(null, error);
}

export async function getBarrierValuesWithDetails(): Promise<QueryResult<any[]>> {
  const { data, error } = await supabase
    .from('barrier_values')
    .select(`
      *,
      pool_types (name, length_meters),
      swimming_styles (name, distance_meters, stroke_type),
      barrier_types (name)
    `)
    .order('age', { ascending: true })
    .order('gender', { ascending: true });

  return handleSupabaseError(data || [], error);
}

// ============================================================================
// User Profile Queries
// ============================================================================

/**
 * Get all user profiles (admin only)
 */
export async function getAllUserProfiles(): Promise<QueryResult<UserProfile[]>> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return handleSupabaseError(data || [], error);
}

/**
 * Get users that are not linked to any swimmer (for assignment)
 */
export async function getAvailableUsers(currentUserId?: string | null): Promise<QueryResult<UserProfile[]>> {
  console.log('🔍 getAvailableUsers called with currentUserId:', currentUserId);

  // Get all users
  const { data: allUsers, error: usersError } = await supabase
    .from('user_profiles')
    .select('*');

  console.log('📊 All users query result:', { allUsers, usersError });

  if (usersError) {
    console.error('❌ Error fetching users:', usersError);
    return handleSupabaseError([], usersError);
  }

  // Get all linked user IDs
  const { data: linkedUserIds, error: linkedError } = await supabase
    .from('swimmers')
    .select('user_id')
    .not('user_id', 'is', null);

  console.log('🔗 Linked users query result:', { linkedUserIds, linkedError });

  if (linkedError) {
    console.error('❌ Error fetching linked users:', linkedError);
    return handleSupabaseError([], linkedError);
  }

  // Filter out users that are already linked to swimmers
  const linkedIds = new Set(linkedUserIds?.map((s: any) => s.user_id) || []);

  // If we have a currentUserId (e.g. editing a swimmer), allow that user to be selected
  if (currentUserId) {
    linkedIds.delete(currentUserId);
  }

  const availableUsers = (allUsers || []).filter(
    (user: UserProfile) => !linkedIds.has(user.id)
  );

  console.log('✅ Available users:', availableUsers);

  return handleSupabaseError(availableUsers, null);
}

/**
 * Get swimmers with their user information
 */
export async function getSwimmersWithUsers(): Promise<QueryResult<any[]>> {
  const { data, error } = await supabase
    .from('swimmers')
    .select(`
      *,
      user_profiles (
        id,
        role,
        full_name
      )
    `)
    .order('created_at', { ascending: false });

  return handleSupabaseError(data || [], error);
}

/**
 * Link a user to a swimmer
 */
export async function linkUserToSwimmer(
  swimmerId: string,
  userId: string | null
): Promise<QueryResult<Swimmer>> {
  const { data, error } = await supabase
    .from('swimmers')
    .update({ user_id: userId })
    .eq('id', swimmerId)
    .select()
    .single();

  return handleSupabaseError(data, error);
}


