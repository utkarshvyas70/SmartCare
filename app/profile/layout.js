'use client';

import React from 'react';
import { useUser } from '@/app/hooks/useUser';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { handleLogout } from '../actions/auth';

// A full set of icons is essential for a professional UI
import {
  HiOutlineUserCircle, HiOutlineCog, HiOutlineCalendar, HiOutlineDocumentText,
  HiOutlineBookmark, HiOutlineCollection, HiOutlineUsers, HiOutlineLogout
} from 'react-icons/hi';

// --- Sidebar Sub-component ---
// Co-located here as it's exclusively used by this layout.
function Sidebar({ user }) {
  const pathname = usePathname();
  const name = user.role === 'patient' ? user.patient_name : user.doctor_name;
  const photoURL = user.profile_photo_url;
  const letter = (name?.[0] || 'U').toUpperCase();

  const patientNavLinks = [
    { href: '/profile', label: 'Account Overview', icon: HiOutlineUserCircle },
    { href: '/profile/settings', label: 'Profile Settings', icon: HiOutlineCog },
    { href: '/profile/appointments', label: 'My Appointments', icon: HiOutlineCalendar },
    { href: '/profile/records', label: 'Medical Records', icon: HiOutlineDocumentText },
  ];

  const doctorNavLinks = [
    { href: '/profile', label: 'Dashboard Overview', icon: HiOutlineCollection },
    { href: '/profile/settings', label: 'Profile Settings', icon: HiOutlineCog },
    { href: '/profile/schedule', label: 'Schedule Management', icon: HiOutlineCalendar },
    { href: '/profile/appointments', label: 'My Patients', icon: HiOutlineUsers },
  ];
  
  const navLinks = user.role === 'patient' ? patientNavLinks : doctorNavLinks;

  return (
    // On large screens, the sidebar takes up 4 of 12 columns (1/3 of the width).
    <aside className="lg:col-span-3">
      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
        {/* Profile Header */}
        <div className="text-center">
          {photoURL ? (
            <Image
              src={photoURL}
              alt={name}
              width={100}
              height={100}
              className="rounded-full object-cover border-4 border-emerald-100 shadow-sm mx-auto"
            />
          ) : (
            <div className="w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-4xl font-bold">
              {letter}
            </div>
          )}
          <h2 className="mt-4 text-xl font-bold text-slate-800 truncate">{name}</h2>
          <p className="text-sm text-slate-500 truncate">{user.email}</p>
          <span className={`mt-3 inline-block px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'doctor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
            {user.role === 'doctor' ? 'Doctor' : 'Patient'}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`w-full flex items-center gap-4 px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 ease-in-out ${
                pathname === link.href
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <link.icon className="w-6 h-6 flex-shrink-0" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        
        {/* Sign Out Button at the bottom */}
        <div className="mt-8 pt-4 border-t border-gray-200">
           <form action={handleLogout} className="w-full">
            <button
              type="submit"
              className="w-full flex items-center gap-4 px-4 py-3 text-base font-semibold rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <HiOutlineLogout className="w-6 h-6" />
              <span>Sign Out</span>
            </button>
           </form>
        </div>
      </div>
    </aside>
  );
}


// --- Main Profile Layout Component ---
export default function ProfileLayout({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-500">Loading Dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Authentication Required</h2>
          <p className="mt-2 text-slate-500">Please log in to access your CarePath profile.</p>
          <Link href="/login" className="mt-6 inline-block px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 shadow-sm transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Sidebar user={user} />
          <main className="lg:col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}