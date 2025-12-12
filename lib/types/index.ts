// User Role
export type UserRole = 'admin' | 'athlete';

// User Profile
export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string | null;
  created_at: Date;
  updated_at: Date;
}

// Swimmer
export interface Swimmer {
  id: string;
  name: string;
  surname: string;
  age: number;
  gender: 'Erkek' | 'Kadın';
  user_id: string | null;
  created_at: Date;
}

// Race Record
export interface RaceRecord {
  id: string;
  swimmer_id: string;
  pool_type: '25m' | '50m';
  swimming_style: string;
  month: number;
  year: number;
  total_milliseconds: number;
  created_at: Date;
}

// Time representation
export interface SwimTime {
  minutes: number;
  seconds: number;
  /** Represents centiseconds (salise) - 0 to 99, not milliseconds */
  milliseconds: number;
}

// Pool Type
export interface PoolType {
  id: string;
  name: string;
  length_meters: number;
}

// Swimming Style
export interface SwimmingStyle {
  id: string;
  name: string;
  distance_meters: number;
  stroke_type: 'Serbest' | 'Sırtüstü' | 'Kelebek' | 'Kurbağalama' | 'Karışık';
  stroke?: string; // Alias for stroke_type for compatibility
}

// Barrier Type
export interface BarrierType {
  id: string;
  name: string;
  category: '12 Yaş' | 'SEM';
}

// Barrier Value
export interface BarrierValue {
  id: string;
  barrier_type_id: string;
  swimming_style_id: string;
  pool_type_id: string;
  age: number;
  gender: 'Erkek' | 'Kadın';
  time_milliseconds: number;
}

// Chart data point
export interface ChartDataPoint {
  date: string;
  time: number;
  formattedTime: string;
  difference?: number;
}

// Barrier evaluation result
export interface BarrierEvaluation {
  barrierName: string;
  achieved: boolean;
  swimmerTime: number;
  barrierTime: number;
}
