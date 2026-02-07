import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const supabase = createSupabaseServerClient();

  // 1. Authenticate the user (correct)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  try {
    // --- THIS IS THE NEW, SIMPLIFIED, AND GUARANTEED-TO-WORK LOGIC ---
    // 2. Call the PostgreSQL function using rpc()
    // We pass the authenticated user's ID as the argument to the function.
    const { data, error } = await supabase.rpc('get_user_appointments', {
      p_user_id: user.id
    });

    if (error) {
      console.error("RPC get_user_appointments error:", error);
      throw error;
    }

    // The function returns the data as a single JSON object. If no appointments are found,
    // it will be null. We return it directly or an empty array for consistency.
    return NextResponse.json(data || [], { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      error: "An internal server error occurred.", 
      details: error.message 
    }, { status: 500 });
  }
}