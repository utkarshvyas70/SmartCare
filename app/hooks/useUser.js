"use client";

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/app/lib/supabase/client'

// This custom hook provides the full user profile and a loading state.
export function useUser() {
  const supabase = createSupabaseBrowserClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This async function fetches the user profile
    const fetchUserProfile = async (supabaseUser) => {
      if (!supabaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Use the same nested select from our server-side function
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          id,
          role,
          onboarding_complete,
          patient_details (*),
          doctor_details (*)
        `)
        .eq('id', supabaseUser.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile in useUser hook:", error.message);
        setUser(null); // Or handle error appropriately
      } else {
        const userDetails = profile.role === 'doctor' 
          ? profile.doctor_details 
          : profile.patient_details;

        // Combine all data into a single user object
        setUser({
          ...supabaseUser,
          ...profile,
          ...userDetails,
        });
      }
      setLoading(false);
    };

    // First, get the initial session
    const getInitialUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      fetchUserProfile(user);
    };

    getInitialUser();

    // Then, set up a listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      fetchUserProfile(session?.user ?? null);
    });

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, loading };
}