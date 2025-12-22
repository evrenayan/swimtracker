import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const cookieStore = await cookies();

    // Create Supabase server client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    // Get current user ID from query params (optional)
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');

    try {
        // Test connection with swimmers table first
        const { data: swimmersData, error: swimmersError } = await supabase
            .from('swimmers')
            .select('id')
            .limit(1);

        // Check auth user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // Get all users
        const { data: allUsers, error: usersError } = await supabase
            .from('user_profiles')
            .select('*');

        if (usersError) {
            console.error('Error fetching users:', usersError);
            // If 404, it might be that the table doesn't exist or RLS is blocking
            if (usersError.code === '42P01') { // undefined_table
                return NextResponse.json({ data: [] }); // Return empty if table doesn't exist
            }
            return NextResponse.json(
                { error: usersError.message, code: usersError.code, details: usersError.details },
                { status: 500 }
            );
        }

        // Get all linked user IDs
        const { data: linkedUserIds, error: linkedError } = await supabase
            .from('swimmers')
            .select('user_id')
            .not('user_id', 'is', null);

        if (linkedError) {
            console.error('Error fetching linked users:', linkedError);
            return NextResponse.json(
                { error: linkedError.message },
                { status: 500 }
            );
        }

        // Filter out users that are already linked to swimmers
        const linkedIds = new Set(linkedUserIds?.map((s: any) => s.user_id) || []);

        // If we have a currentUserId (e.g. editing a swimmer), allow that user to be selected
        if (currentUserId) {
            linkedIds.delete(currentUserId);
        }

        const availableUsers = (allUsers || []).filter(
            (user: any) => !linkedIds.has(user.id)
        );

        return NextResponse.json({ data: availableUsers });
    } catch (error: any) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
