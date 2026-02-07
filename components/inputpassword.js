"use client"
import React, { useState } from "react";

const PasswordInput = ({ placeholder = "Enter your password" }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="relative">
      <input
        type={passwordVisible ? "text" : "password"}
        placeholder={placeholder}
        className="w-full px-4 py-2 mb-4 bg-white bg-opacity-40 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-3 flex items-center bottom-4"
      >
        {passwordVisible ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-7.05 5.95A9 9 0 003.34 12a9 9 0 0115.32 0 9 9 0 01-4.61 4.61m1.97-1.97a9 9 0 11-13.78-13.78 9 9 0 0113.78 13.78z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3l18 18M9.75 9.75L4.5 4.5M19.5 19.5L14.25 14.25m4.97-1.41a8.5 8.5 0 00-13.74 0m9.79 1.75A3 3 0 0012 12m-7.9 2.4a9.02 9.02 0 010-4.8"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PasswordInput;