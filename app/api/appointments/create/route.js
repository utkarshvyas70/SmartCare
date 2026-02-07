import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";
import { addMinutes, parseISO } from 'date-fns';

// This is a POST handler, as creating an appointment is a mutation.
export async function POST(request) {
  const supabase = createSupabaseServerClient();

  // 1. Authenticate the user (the patient)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  
  // 2. Get the booking details from the request body
  const { doctorId, slot_start_time, reason_for_visit } = await request.json();

  // 3. Validate the inputs
  if (!doctorId || !slot_start_time) {
    return NextResponse.json({ error: 'Doctor ID and slot time are required.' }, { status: 400 });
  }

  const startTime = parseISO(slot_start_time);

  try {
    // --- THIS IS THE NEW RE-BOOKING LOGIC ---
    // 1. Check for an existing CANCELLED appointment for this exact doctor and time slot.
    const { data: existingCancelled, error: checkError } = await supabase
      .from('appointments')
      .select('id, status')
      .eq('doctor_id', doctorId)
      .eq('slot_start_time', startTime.toISOString())
      .in('status', ['Cancelled by Patient', 'Cancelled by Doctor']) // Check for either cancelled status
      .maybeSingle(); // Returns one record or null, without erroring if not found.

    if (checkError) throw checkError;

    // --- Case 1: Re-book an existing cancelled slot ---
    if (existingCancelled) {
      const { data: updatedAppointment, error: updateError } = await supabase
        .from('appointments')
        .update({
          patient_id: user.id, // Assign the new patient
          status: 'Scheduled', // Change status back to Scheduled
          reason_for_visit: reason_for_visit,
          created_at: new Date().toISOString() // Optional: update the timestamp
        })
        .eq('id', existingCancelled.id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return NextResponse.json(updatedAppointment, { status: 200 }); // Return 200 OK
    }

    // --- Case 2: Book a brand new slot ---
    else {
      // (Your existing INSERT logic is perfect for this part)
      const { data: schedule, error: scheduleError } = await supabase
        .from('doctor_schedules').select('slot_duration_minutes').eq('doctor_id', doctorId).single();
      if (scheduleError || !schedule) return NextResponse.json({ error: 'Could not find doctor schedule.' }, { status: 404 });

      const endTime = addMinutes(startTime, schedule.slot_duration_minutes);

      const { data: newAppointment, error: insertError } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id, doctor_id: doctorId,
          slot_start_time: startTime.toISOString(), appointment_end_time: endTime.toISOString(),
          reason_for_visit: reason_for_visit, status: 'Scheduled',
        })
        .select().single();

      if (insertError) {
        if (insertError.code === '23505') {
          return NextResponse.json({ error: 'This time slot was just booked. Please select another.' }, { status: 409 });
        }
        throw insertError;
      }
      return NextResponse.json(newAppointment, { status: 201 }); // 201 Created
    }

  } catch (error) {
    console.error("Create/Re-book appointment error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }

}