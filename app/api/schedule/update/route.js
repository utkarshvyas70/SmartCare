import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";
import { format, parse, addMinutes } from 'date-fns';

// Helper to generate slots for conflict checking
const generateSlots = (start, end, duration) => {
    const slots = []; let currentTime = parse(start, 'HH:mm', new Date()); const endTime = parse(end, 'HH:mm', new Date());
    while (currentTime < endTime) { slots.push(format(currentTime, 'HH:mm')); currentTime = addMinutes(currentTime, duration); }
    return slots;
};

// This is a PUT/PATCH request, as we are updating an existing resource.
export async function PUT(request) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  // Get the proposed new schedule from the request body
  const newSchedule = await request.json();

  try {
    // 1. Fetch the doctor's CURRENT schedule and ALL their upcoming appointments
    const { data: currentSchedule, error: scheduleError } = await supabase
        .from('doctor_schedules').select('*').eq('doctor_id', user.id).single();
    if (scheduleError) throw scheduleError;

    const { data: upcomingAppointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id, slot_start_time')
        .eq('doctor_id', user.id)
        .eq('status', 'Scheduled')
        .gte('slot_start_time', new Date().toISOString());
    if (appointmentsError) throw appointmentsError;

    if (!upcomingAppointments || upcomingAppointments.length === 0) {
        // --- NO CONFLICTS POSSIBLE ---
        // If there are no upcoming appointments, just update the schedule directly.
        const { error: updateError } = await supabase.from('doctor_schedules').update(newSchedule).eq('doctor_id', user.id);
        if (updateError) throw updateError;
        return NextResponse.json({ success: true, message: "Schedule updated successfully." });
    }

    // 2. --- CONFLICT DETECTION LOGIC ---
    const conflictedAppointments = [];
    
    for (const appt of upcomingAppointments) {
        const apptDate = new Date(appt.slot_start_time);
        const apptDayName = format(apptDate, 'eeee').toLowerCase();
        const apptDateString = format(apptDate, 'yyyy-MM-dd');
        const apptTime = format(apptDate, 'HH:mm');

        let isConflict = false;

        // Conflict Type 1: The doctor marked this day as unavailable.
        if (newSchedule.unavailable_dates?.includes(apptDateString)) {
            isConflict = true;
        }

        // Conflict Type 2: The doctor changed their working hours for this day.
        if (!isConflict) {
            const newDayAvailability = newSchedule.weekly_availability[apptDayName] || [];
            const newPotentialSlots = newDayAvailability.flatMap(interval =>
                generateSlots(interval.start, interval.end, newSchedule.slot_duration_minutes)
            );
            
            // If the appointment's time is no longer in the list of potential slots, it's a conflict.
            if (!newPotentialSlots.includes(apptTime)) {
                isConflict = true;
            }
        }
        
        if (isConflict) {
            conflictedAppointments.push(appt);
        }
    }

    // 3. --- RESPOND BASED ON CONFLICTS ---
    if (conflictedAppointments.length > 0) {
        // --- CONFLICTS FOUND ---
        // Return a specific status (409 Conflict) and the list of conflicted appointments.
        // The frontend will use this to show the confirmation modal.
        return NextResponse.json({
            success: false,
            conflict: true,
            message: `Found ${conflictedAppointments.length} conflicting appointments.`,
            conflictedAppointments,
        }, { status: 409 });
    } else {
        // --- NO CONFLICTS FOUND ---
        // It's safe to update the schedule.
        const { error: updateError } = await supabase.from('doctor_schedules').update(newSchedule).eq('doctor_id', user.id);
        if (updateError) throw updateError;
        return NextResponse.json({ success: true, message: "Schedule updated successfully." });
    }

  } catch (error) {
    console.error("Update schedule error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}