import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

// Using POST for this action as it modifies data.
export async function POST(request) {
  const supabase = createSupabaseServerClient();

  // 1. Authenticate the user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  // 2. Get the appointment ID from the request
  const { appointmentId } = await request.json();
  if (!appointmentId) {
    return NextResponse.json({ error: 'Appointment ID is required.' }, { status: 400 });
  }

  try {
    // 3. Fetch the appointment to verify ownership and check its current status
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('patient_id, doctor_id, status')
      .eq('id', appointmentId)
      .single();

    if (fetchError || !appointment) {
      return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 });
    }

    // 4. Authorization: Check if the current user is part of this appointment
    const isPatient = appointment.patient_id === user.id;
    const isDoctor = appointment.doctor_id === user.id;

    if (!isPatient && !isDoctor) {
      return NextResponse.json({ error: 'You are not authorized to cancel this appointment.' }, { status: 403 });
    }
    
    // 5. Business Logic: Prevent cancellation of past or already cancelled appointments
    if (appointment.status !== 'Scheduled') {
        return NextResponse.json({ error: `Cannot cancel an appointment with status: ${appointment.status}` }, { status: 409 });
    }
    
    // 6. Determine the new status based on who is cancelling
    const newStatus = isPatient ? 'Cancelled by Patient' : 'Cancelled by Doctor';

    // 7. Update the appointment status in the database
    const { error: updateError } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', appointmentId);

    if (updateError) {
      console.error("Supabase cancel error:", updateError);
      throw updateError;
    }

    // TODO: In a real-world app, you would trigger a notification email to the other party here.

    // 8. Success
    return NextResponse.json({ message: 'Appointment cancelled successfully.' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}