// This is the updated API route for fetching a doctor's schedule.

import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id : doctorId } = params;

  if (!doctorId) {
    return NextResponse.json({ error: "Doctor ID is required." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  try {
    // UPDATED: The select query now includes the new booking rule fields.
    const { data: schedule, error } = await supabase
      .from('doctor_schedules')
      .select(`
        slot_duration_minutes,
        weekly_availability,
        unavailable_dates,
        booking_horizon_days, 
        lead_time_hours        
      `)
      .eq('doctor_id', doctorId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: `No schedule found for doctor with ID: ${doctorId}` }, { status: 404 });
      }
      console.error('Supabase schedule fetch error:', error);
      throw error;
    }
    
    return NextResponse.json(schedule, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}