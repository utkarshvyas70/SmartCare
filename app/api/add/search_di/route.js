import { NextResponse } from "next/server";
import { createSupabaseBrowserClient } from '@/app/lib/supabase/client';

export const revalidate = 3600;
export const runtime = "edge"; // optional

export async function GET() {
  const supabase = createSupabaseBrowserClient();
  try {
    const { data, error } = await supabase
      .from("diseases")
      .select("disease_name")
      .order("disease_name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("ERROR: ", err.message);
    return NextResponse.json({ success: false, message: "Failed to fetch diseases" });
  }
}