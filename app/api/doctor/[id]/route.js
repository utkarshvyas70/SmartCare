export const revalidate = 60;
export const runtime = 'edge';

import { NextResponse } from "next/server";
import { createSupabaseBrowserClient } from '@/app/lib/supabase/client';

/**
 * @param {Request} request
 * @param {{ params: { id: uuid } }} context
 */
export async function GET(request, { params }) {

  const supabase = createSupabaseBrowserClient();
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Doctor ID is required" }, 
        { status: 400 }
      );
    }

    console.log(id);

    const { data, error } = await supabase
      .from("doctor_details")
      .select(`
        profile_id,
        doctor_name,
        profile_photo_url,
        degree_photo_url,
        professional_statement,
        specialties,
        education,
        years_in_practice,
        languages_spoken,
        average_rating,
        rating_count,
        phone_number
      `)
      .eq("profile_id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Internal server error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
