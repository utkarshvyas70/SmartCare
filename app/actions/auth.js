"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { SignupFormSchema } from "@/app/lib/definations"; // Make sure to import your Zod schema
import { LoginFormSchema } from "@/app/lib/definations";

export async function signup(state, formData) {
  // 1. Validate form fields with Zod
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return the errors to the form
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      usererror: null, // Ensure usererror is null when there are field errors
    };
  }

  // 2. Get the validated data and the role
  const { name, email, password } = validatedFields.data;
  const role = formData.get("role"); // 'patient' or 'doctor' from your new radio buttons

  if (!role) {
    return { errors: {}, usererror: "Please select a role (Patient or Doctor)." };
  }

  const supabase = createSupabaseServerClient();

  // 3. Call Supabase Auth to sign up the user
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        role: role,
      },
    },
  });


  // 4. Handle Supabase-specific errors (like "User already exists")
  if (error) {
    console.error("Supabase signup error:", error.message);
    return {
      errors: {},
      usererror: error.message, // This will be displayed in your "usererror" div
    };
  }

  redirect("/"); 
}




export async function login(state, formData) {
  // 1. Validate form fields with Zod
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If fields are invalid, return errors to the form immediately
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      usererror: null,
    };
  }

  // 2. Get the validated data
  const { email, password } = validatedFields.data;
  const supabase = createSupabaseServerClient();

  // 3. Call Supabase Auth to sign in the user
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // 4. Handle authentication errors from Supabase (e.g., "Invalid login credentials")
  if (error) {
    console.error("Supabase login error:", error.message);
    return {
      errors: {},
      usererror: "Invalid login credentials. Please check your email and password.",
    };
  }
  
  // 5. Success: Revalidate and redirect
  redirect("/");
}




export async function handleLogout() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/Login");
}