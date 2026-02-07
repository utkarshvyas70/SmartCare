import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";
import { startOfDay, endOfDay, parseISO } from 'date-fns';

export async function GET(request) {
  // We will get parameters from the URL's query string.
  // e.g., /api/appointments?doctorId=...&date=2025-08-18
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get('doctorId');
  const date = searchParams.get('date'); // This will be a string like "2025-08-18"

  // 1. Validate the inputs
  if (!doctorId || !date) {
    return NextResponse.json(
      { error: "Both doctorId and date are required parameters." },
      { status: 400 } // Bad Request
    );
  }

  // 2. Create a Supabase client
  const supabase = createSupabaseServerClient();

  try {
    // 3. Define the time range for the query
    // We want all appointments from the very start to the very end of the given day.
    const startDate = startOfDay(parseISO(date));
    const endDate = endOfDay(parseISO(date));

    // 4. Fetch the appointments from the database
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('slot_start_time') // We only need the start time for the booking page
      .eq('doctor_id', doctorId)
      .gte('slot_start_time', startDate.toISOString()) // Greater than or equal to the start of the day
      .lte('slot_start_time', endDate.toISOString()) // Less than or equal to the end of the day

      .neq('status', 'Cancelled by Patient')
      .neq('status', 'Cancelled by Doctor');

    if (error) {
      console.error('Supabase appointments fetch error:', error);
      throw error; // Let the catch block handle it
    }

    // 5. If successful, return just the array of start times.
    // The frontend only needs to know which slots are booked.
    const bookedSlots = appointments.map(appt => appt.slot_start_time);
    return NextResponse.json(bookedSlots, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "An internal server error occurred while fetching appointments." },
      { status: 500 }
    );
  }
}