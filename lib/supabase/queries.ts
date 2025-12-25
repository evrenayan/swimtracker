import { supabase } from './client';
import { logger } from '../logger';
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
  error: any,
  action: string
): QueryResult<T> {
  if (error) {
    logger.error(action, { error });
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

  if (!error) {
    logger.info('create_swimmer', { swimmer_id: data?.id });
  }

  return handleSupabaseError(data, error, 'create_swimmer');
}

export async function getSwimmer(id: string): Promise<QueryResult<Swimmer>> {
  const { data, error } = await supabase
    .from('swimmers')
    .select('*')
    .eq('id', id)
    .single();

  return handleSupabaseError(data, error, 'get_swimmer');
}

export async function getAllSwimmers(): Promise<QueryResult<Swimmer[]>> {
  const { data, error } = await supabase
    .from('swimmers')
    .select('*')
    .order('created_at', { ascending: false });

  return handleSupabaseError(data || [], error, 'get_all_swimmers');
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

  if (!error) {
    logger.info('update_swimmer', { swimmer_id: id, updates });
  }

  return handleSupabaseError(data, error, 'update_swimmer');
}

export async function deleteSwimmer(id: string): Promise<QueryResult<void>> {
  const { error } = await supabase
    .from('swimmers')
    .delete()
    .eq('id', id);

  if (!error) {
    logger.info('delete_swimmer', { swimmer_id: id });
  }

  return handleSupabaseError(null, error, 'delete_swimmer');
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

  if (!error) {
    logger.info('create_race_record', { record_id: data?.id });
  }

  return handleSupabaseError(data, error, 'create_race_record');
}

export async function getRaceRecord(
  id: string
): Promise<QueryResult<RaceRecord>> {
  const { data, error } = await supabase
    .from('race_records')
    .select('*')
    .eq('id', id)
    .single();

  return handleSupabaseError(data, error, 'get_race_record');
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

  return handleSupabaseError(data || [], error, 'get_race_records_by_swimmer');
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

  return handleSupabaseError(data || [], error, 'get_race_records_by_style');
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

  if (!error) {
    logger.info('update_race_record', { record_id: id, updates });
  }

  return handleSupabaseError(data, error, 'update_race_record');
}

export async function deleteRaceRecord(id: string): Promise<QueryResult<void>> {
  const { error } = await supabase
    .from('race_records')
    .delete()
    .eq('id', id);

  if (!error) {
    logger.info('delete_race_record', { record_id: id });
  }

  return handleSupabaseError(null, error, 'delete_race_record');
}

// ============================================================================
// Reference Data Queries
// ============================================================================

export async function getAllPoolTypes(): Promise<QueryResult<PoolType[]>> {
  const { data, error } = await supabase
    .from('pool_types')
    .select('*')
    .order('length_meters', { ascending: true });

  return handleSupabaseError(data || [], error, 'get_pool_types');
}

export async function getAllSwimmingStyles(): Promise<
  QueryResult<SwimmingStyle[]>
> {
  const { data, error } = await supabase
    .from('swimming_styles')
    .select('*')
    .order('distance_meters', { ascending: true });

  return handleSupabaseError(data || [], error, 'get_swimming_styles');
}

export async function getAllBarrierTypes(): Promise<QueryResult<BarrierType[]>> {
  const { data, error } = await supabase
    .from('barrier_types')
    .select('*')
    .order('name', { ascending: true });

  return handleSupabaseError(data || [], error, 'get_barrier_types');
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

  return handleSupabaseError(data || [], error, 'get_barrier_values');
}

export async function getAllBarrierValues(): Promise<
  QueryResult<BarrierValue[]>
> {
  const { data, error } = await supabase
    .from('barrier_values')
    .select('*');

  return handleSupabaseError(data || [], error, 'get_all_barrier_values');
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

  return handleSupabaseError(data, error, 'get_best_time');
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
    return handleSupabaseError(null, error, 'get_swimmer_race_count');
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

  if (!error) {
    logger.info('create_barrier_value', { barrier_id: data?.id });
  }

  return handleSupabaseError(data, error, 'create_barrier_value');
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

  if (!error) {
    logger.info('update_barrier_value', { barrier_id: id, updates });
  }

  return handleSupabaseError(data, error, 'update_barrier_value');
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

  if (!error) {
    logger.info('delete_barrier_value', { barrier_id: id });
  }

  return handleSupabaseError(null, error, 'delete_barrier_value');
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

  return handleSupabaseError(data || [], error, 'get_barrier_values_details');
}

export async function getSwimmerBarriers(
  age: number,
  gender: string
): Promise<QueryResult<any[]>> {
  const { data, error } = await supabase
    .from('barrier_values')
    .select(`
      *,
      pool_types (name, length_meters),
      swimming_styles (name, distance_meters, stroke_type),
      barrier_types (name)
    `)
    .eq('age', age)
    .eq('gender', gender);

  return handleSupabaseError(data || [], error, 'get_swimmer_barriers');
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

  return handleSupabaseError(data || [], error, 'get_all_user_profiles');
}

/**
 * Get users that are not linked to any swimmer (for assignment)
 */
export async function getAvailableUsers(currentUserId?: string | null): Promise<QueryResult<UserProfile[]>> {
  // Get all users
  const { data: allUsers, error: usersError } = await supabase
    .from('user_profiles')
    .select('*');

  if (usersError) {
    logger.error('get_available_users', { error: usersError });
    return handleSupabaseError([], usersError, 'get_available_users');
  }

  // Get all linked user IDs
  const { data: linkedUserIds, error: linkedError } = await supabase
    .from('swimmers')
    .select('user_id')
    .not('user_id', 'is', null);

  if (linkedError) {
    logger.error('get_available_users_linked', { error: linkedError });
    return handleSupabaseError([], linkedError, 'get_available_users_linked');
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

  return handleSupabaseError(availableUsers, null, 'get_available_users');
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

  return handleSupabaseError(data || [], error, 'get_swimmers_with_users');
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

  if (!error) {
    logger.info('link_user_to_swimmer', { swimmer_id: swimmerId, user_id: userId });
  }

  return handleSupabaseError(data, error, 'link_user_to_swimmer');
}
