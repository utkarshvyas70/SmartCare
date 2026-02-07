export const revalidate = 60;
export const runtime = 'edge';

import { NextResponse } from "next/server";
import { createSupabaseBrowserClient } from '@/app/lib/supabase/client';

export async function POST(request) {
    const supabase = createSupabaseBrowserClient();
    try {
        const { disease_name } = await request.json();
        console.log("Received disease_name in API:", disease_name);

        const { data, error } = await supabase
            .from('diseases')
            .select('*')
            .eq('disease_name', disease_name);

        if (error) {
            console.error("Supabase error:", error.message);
            return NextResponse.json({ success: false, message: 'Database error' });
        }

        if (data && data.length > 0) {
            console.log("Data found:", data);
            return NextResponse.json({ success: true, data });
        } else {
            console.log("No data matched.");
            return NextResponse.json({ success: false, message: 'Data not found' });
        }

    } catch (err) {
        console.error("Internal server error:", err);
        return NextResponse.json({ success: false, message: 'Internal server error' });
    }
}
