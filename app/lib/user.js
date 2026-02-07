import { createSupabaseServerClient } from "@/app/lib/supabase/server"; // Or your path
import { cache } from 'react';

export const getFullUserProfile = cache(async () => {
  const supabase = createSupabaseServerClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  // If there's an error or no user, we return null immediately.
  if (userError || !userData?.user) {
    return null;
  }
  
  const user = userData.user; // We now safely have the user object.

  // Fetch the rest of the profile data
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      id,
      role,
      onboarding_complete,
      patient_details (*),
      doctor_details (*)
    `)
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    console.error("Error fetching full profile:", error?.message);
    // Return the basic user object even if the profile is missing
    return { id: user.id, email: user.email, role: null };
  }
  
  const userDetails = profile.role === 'doctor' 
    ? profile.doctor_details 
    : profile.patient_details;

  return {
    id: user.id,
    email: user.email,
    role: profile.role,
    onboarding_complete: profile.onboarding_complete,
    ...userDetails
  };
});