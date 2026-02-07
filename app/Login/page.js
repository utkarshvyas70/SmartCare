"use client"
import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useFormState, useFormStatus } from 'react-dom'
import { login } from '../actions/auth';

export default function AuthPage() {
  // Set a clear initial state for the form
  const initialState = { errors: {}, usererror: null };
  const [state, action] = useFormState(login, initialState);

  return (
    <>
      <div className="relative min-h-screen flex bg-cover bg-center bg-[url('/Assets/images/bgimage.jpg')]" >

        <div className="absolute inset-0 bg-gradient-to-t from-black via-[#0128008a] via-black via-transparent via-black via-[#0128008a] to-black opacity-90 z-0"></div>

        <div className="relative z-10 w-full max-w-sm sm:mr-16 sm:ml-auto mx-auto bg-green-100 bg-opacity-20 backdrop-blur rounded-xl shadow-lg p-6 my-auto flex flex-col justify-center items-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Welcome to CarePath</h2>
          <form action={action} className="w-full">
            <input
              type="email" name="email"
              placeholder="Email"
              className="w-full px-4 py-2 mb-1 placeholder:text-gray-600 bg-white bg-opacity-40 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {/* Cleaned-up error display */}
            {state?.errors?.email &&
              <p className="text-red-400 text-xs mb-3">{state.errors.email}</p>
            }

            <input
              type="password" name="password"
              placeholder="Password"
              className="w-full px-4 py-2 mt-3 mb-1 placeholder:text-gray-600 bg-white bg-opacity-40 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {/* Cleaned-up error display */}
            {state?.errors?.password &&
              <p className="text-red-400 text-xs mb-3">{state.errors.password}</p>
            }

            {/* This will display "Invalid login credentials" */}
            {state?.usererror && 
              <div className="text-red-400 text-sm mt-3 mb-2 text-center bg-red-900 bg-opacity-50 p-2 rounded-md">
                <p>{state.usererror}</p>
              </div>
            }
            <div className="mt-4">
              <SubmitButton />
            </div>
          </form>

          <div className="w-full border-t border-gray-300 my-4"></div>

          {/* Note: Google login requires a separate server action */}
          <button className="flex items-center justify-center w-full px-6 py-3 mb-4 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none">
            <FaGoogle className="mr-2" />
            Log in with Google
          </button>

          <p className="mt-2 text-sm text-white">
            Don’t have an account? <a href="/signup" className="text-blue-400 font-medium hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type='submit' disabled={pending} className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-400">
      {pending ? 'Logging In...' : 'Log In'}
    </button>
  );
}