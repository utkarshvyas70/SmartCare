"use client"
import { FaGoogle } from 'react-icons/fa';
import { useFormState, useFormStatus } from 'react-dom'
import React, { useState } from 'react';
import { signup } from '../actions/auth';

export default function SignUpPage() {
  const initialState = { usererror: null, errors: {} };
  const [state, action] = useFormState(signup, initialState);

  // 👇 central source of truth for selection
  const [role, setRole] = useState("patient");

  return (
    <div className="relative min-h-screen flex bg-cover bg-center bg-[url('/Assets/images/bgimage2.jpeg')]">
      {/* Background overlay */}
      <div className="absolute inset-0 
        bg-gradient-to-t from-black via-[#0128008a] via-black via-transparent 
        via-black via-[#0128008a] to-black opacity-90 z-0">
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-sm sm:mr-10 sm:ml-auto mx-auto 
          bg-green-100 bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg 
          p-6 my-auto flex flex-col justify-center items-center">
        
        <h2 className="text-3xl font-semibold text-white mb-4">Create an Account</h2>

        <form action={action} className="w-full">
          {/* Full Name */}
          <input
            type="text" name="name" id="name"
            placeholder="Full Name"
            className="w-full px-4 py-2 mb-4 placeholder:text-gray-600 
              bg-white bg-opacity-40 border border-gray-400 rounded-lg text-gray-900 
              focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {state?.errors?.name && <p className="text-red-500 text-xs -mt-2 mb-2">{state.errors.name}</p>}

          {/* Email */}
          <input
            type="email" name="email" id="email"
            placeholder="Email"
            className="w-full px-4 py-2 mb-4 placeholder:text-gray-600 
              bg-white bg-opacity-40 border border-gray-400 rounded-lg text-gray-900 
              focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {state?.errors?.email && <p className="text-red-500 text-xs -mt-2 mb-2">{state.errors.email}</p>}

          {/* Password */}
          <input
            type="password" name="password" id="password"
            placeholder="Password"
            className="w-full px-4 py-2 mb-4 placeholder:text-gray-600 
              bg-white bg-opacity-40 border border-gray-400 rounded-lg text-gray-900 
              focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {state?.errors?.password && (
            <div className="text-red-500 text-xs -mt-2 mb-2">
              <p>Password must:</p>
              <ul className="list-disc list-inside">
                {state.errors.password.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-4 text-white w-full">
            <label className="block mb-2 text-base text-gray-800 font-medium">Register as:</label>
            <div className="flex gap-4">
              <RoleButton label="Patient" value="patient" selected={role === "patient"} onSelect={setRole} />
              <RoleButton label="Doctor" value="doctor" selected={role === "doctor"} onSelect={setRole} />
            </div>
            {/* hidden input used so form actually posts "role" */}
            <input type="hidden" name="role" value={role} />
          </div>

          {/* Error message for user already exists */}
          {state?.usererror &&
            <div className="text-red-400 text-sm -mt-2 mb-2 text-center 
                bg-red-900 bg-opacity-50 p-2 rounded-md">
              <p>{state.usererror}</p>
            </div>
          }

          {/* Submit */}
          <SubmitButton />
        </form>

        <div className="w-full border-t border-gray-300 my-3"></div>

        {/* Google Auth */}
        <button className="flex items-center justify-center w-full px-6 py-3 mb-4 
            text-white bg-blue-500 rounded-lg shadow-md 
            hover:bg-blue-600 focus:outline-none">
          <FaGoogle className="mr-2" />
          Sign up with Google
        </button>

        <p className="mt-4 text-sm text-gray-300">
          Already have an account? 
          <a href="/login" className="text-blue-400 hover:underline"> Sign in</a>
        </p>
      </div>
    </div>
  );
}

/* RoleButton controlled by parent state */
function RoleButton({ label, value, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(value)}
      className={`
        flex-1 text-center py-3 rounded-lg cursor-pointer font-semibold
        transition-all duration-200 border
        ${selected
          ? "bg-blue-600 text-white border-blue-500 shadow-md"
          : "bg-gray-600 bg-opacity-60 text-white hover:bg-opacity-70 border-gray-400"}
      `}
    >
      {label}
    </div>
  );
}

/* SubmitButton */
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      disabled={pending} 
      type='submit' 
      className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md 
        hover:bg-blue-600 disabled:bg-gray-400">
      {pending ? 'Signing Up...' : 'Sign Up'}
    </button>
  )
}
