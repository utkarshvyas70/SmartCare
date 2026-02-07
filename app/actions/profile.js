'use server';

// --- THE ONLY CHANGE YOU NEED ---
// Import the SERVER client, not the browser client.
import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (this part is correct)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// The uploadImage helper function is correct and does not need changes.
async function uploadImage(file) {
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({
      resource_type: 'image',
      folder: 'carepath_profiles',
    }, (err, result) => {
      if (err) {
        console.error('Cloudinary upload error:', err);
        reject(new Error('Failed to upload image.'));
      } else {
        resolve(result.secure_url);
      }
    }).end(buffer);
  });
}


export async function updateProfile(prevState, formData) {
  // Use the SERVER client here. It knows how to read the user's cookie
  // in a Server Action environment.
  const supabase = createSupabaseServerClient();

  // This will now work correctly and find the authenticated user.
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, message: 'Authentication required. Please log in again.' };
  }

  // The rest of your function is perfect and will now execute correctly.
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, message: 'User profile not found.' };
  }

  const profilePhotoFile = formData.get('profile_photo_file');
  const degreePhotoFile = formData.get('degree_photo_file');

  let profilePhotoUrl, degreePhotoUrl;
  try {
    [profilePhotoUrl, degreePhotoUrl] = await Promise.all([
      uploadImage(profilePhotoFile),
      profile.role === 'doctor' ? uploadImage(degreePhotoFile) : Promise.resolve(null)
    ]);
  } catch (error) {
    return { success: false, message: error.message };
  }

  let dataToUpdate = {};
  
  if (profile.role === 'patient') {
    // ... (Your patient data logic is correct)
    const allergies = formData.get('allergies')?.split(',').map(s => s.trim()).filter(Boolean);
    const chronic_conditions = formData.get('chronic_conditions')?.split(',').map(s => s.trim()).filter(Boolean);
    dataToUpdate = {
      patient_name: formData.get('patient_name'), phone_number: formData.get('phone_number'),
      date_of_birth: formData.get('date_of_birth') || null, gender: formData.get('gender') || null,
      address: { street: formData.get('street'), city: formData.get('city'), state: formData.get('state'), },
      blood_group: formData.get('blood_group') || null, height_cm: formData.get('height_cm') || null,
      weight_kg: formData.get('weight_kg') || null, allergies: allergies, chronic_conditions: chronic_conditions,
      lifestyle_habits: { smoking: formData.get('smoking'), alcohol: formData.get('alcohol'), },
      ...(profilePhotoUrl && { profile_photo_url: profilePhotoUrl }),
    };
    const { error } = await supabase.from('patient_details').update(dataToUpdate).eq('profile_id', user.id);
    if (error) {
        console.error('Supabase patient update error:', error);
        return { success: false, message: 'Failed to update patient profile.' };
    }
  } 
  
  
  else if (profile.role === 'doctor') {
    // ... (Your doctor data logic is correct)
    dataToUpdate = {
      doctor_name: formData.get('doctor_name'), phone_number: formData.get('phone_number'),
      professional_statement: formData.get('professional_statement'), years_in_practice: formData.get('years_in_practice') || null,
      specialties: JSON.parse(formData.get('specialties')), languages_spoken: JSON.parse(formData.get('languages_spoken')),
      education: JSON.parse(formData.get('education')),
      ...(profilePhotoUrl && { profile_photo_url: profilePhotoUrl }),
      ...(degreePhotoUrl && { degree_photo_url: degreePhotoUrl }),
    };
    const { error } = await supabase.from('doctor_details').update(dataToUpdate).eq('profile_id', user.id);
    if (error) {
        console.error('Supabase doctor update error:', error);
        return { success: false, message: 'Failed to update doctor profile.' };
    }
  }

  await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', user.id);
  
  revalidatePath('/profile/settings');
  
  return { success: true, message: 'Profile updated successfully!' };
}