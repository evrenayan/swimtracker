import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

// Define LogLevel type
export type LogLevel = 'info' | 'warning' | 'error';

// Define LogEntry interface
interface LogEntry {
    action: string;
    level: LogLevel;
    details?: any;
    user_id?: string | null;
}

// Client-side logger
export const logToSupabase = async (entry: LogEntry, supabaseClient?: SupabaseClient) => {
    try {
        let supabase = supabaseClient;
        if (!supabase) {
            supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
        }

        // Attempt to get user if not provided and we are in a browser context
        if (entry.user_id === undefined && typeof window !== 'undefined') {
            const { data: { session } } = await supabase.auth.getSession();
            entry.user_id = session?.user?.id || null;
        }

        const { error } = await supabase
            .from('logs')
            .insert([
                {
                    action: entry.action,
                    level: entry.level,
                    details: entry.details,
                    user_id: entry.user_id,
                },
            ]);

        if (error) {
            // Fallback to console if logging fails to prevent infinite loops
            console.warn('Failed to log to Supabase:', error);
        }
    } catch (err) {
        console.warn('Logging failed silently:', err);
    }
};


// Helper functions
export const logger = {
    info: (action: string, details?: any, userId?: string) => logToSupabase({ action, level: 'info', details, user_id: userId }),
    warn: (action: string, details?: any, userId?: string) => logToSupabase({ action, level: 'warning', details, user_id: userId }),
    error: (action: string, details?: any, userId?: string) => logToSupabase({ action, level: 'error', details, user_id: userId }),
};
