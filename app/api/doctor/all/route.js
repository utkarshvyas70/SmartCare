export const revalidate = 60;
export const runtime = 'edge';

import { NextResponse } from "next/server";
import { createSupabaseBrowserClient } from '@/app/lib/supabase/client';

export async function GET() {

  const supabase = createSupabaseBrowserClient();
  try {
    const { data, error } = await supabase
      .from("doctor_details")
      .select("profile_id, doctor_name, profile_photo_url, specialties, average_rating, rating_count");

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ success: false, message: "Database error" });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: false, message: "No doctors found" });
    }

    // Prepare the response with only the first specialty for each doctor
    const formatted = data.map((doc) => ({
      profile_id: doc.profile_id,
      doctor_name: doc.doctor_name,
      profile_photo_url: doc.profile_photo_url,
      specialties: Array.isArray(doc.specialties) && doc.specialties.length > 0
        ? doc.specialties
        : null,
      average_rating: doc.average_rating,
      rating_count: doc.rating_count,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (err) {
    console.error("Internal server error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" });
  }
}
