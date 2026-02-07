'use client';

import React from 'react';
import { useUser } from '@/app/hooks/useUser';
import Link from 'next/link';
import { 
  HiOutlineCalendar, HiOutlineBookmark, HiOutlineDocumentText, HiOutlineClock, 
  HiOutlineUsers, HiOutlineArrowRight, HiOutlineDotsVertical, HiOutlineShieldCheck
} from 'react-icons/hi';

// --- Reusable, Polished Card Components ---

function StatCard({ title, value, icon: Icon, iconBgColor = 'bg-gray-100', iconColor = 'text-gray-600' }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

function ActionCard({ title, description, linkText, href = "#" }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="font-bold text-lg text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-2 flex-grow">{description}</p>
      <Link href={href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition-colors group">
        {linkText} <HiOutlineArrowRight className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

// --- Main Overview Page ---
export default function OverviewPage() {
  const { user, loading } = useUser();

  if (loading || !user) {
    return <div className="space-y-6"><div className="h-96 bg-white rounded-xl shadow-sm animate-pulse"></div></div>;
  }
  
  // --- PATIENT DASHBOARD ---
  if (user.role === 'patient') {
    const completionPercentage = user.onboarding_complete ? 100 : 75;
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Good evening, {user.patient_name}!</h1>
          <p className="mt-2 text-lg text-slate-500">Welcome to your personal health hub.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Past Consultations" value="5" icon={HiOutlineCalendar} iconBgColor="bg-green-100" iconColor="text-green-600"/>
          <StatCard title="Saved Doctors" value="3" icon={HiOutlineBookmark} iconBgColor="bg-blue-100" iconColor="text-blue-600"/>
          <StatCard title="Medical Records" value="8" icon={HiOutlineDocumentText} iconBgColor="bg-purple-100" iconColor="text-purple-600"/>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
             <p className="text-sm font-semibold text-slate-500">Profile Score</p>
             <p className="text-4xl font-bold text-slate-800 mt-4">{completionPercentage}%</p>
             <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
              </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard title="Recent Activity" description="New lab results added for your recent check-up with Dr. Evelyn Reed." linkText="View Record" href="/profile/records" />
          <ActionCard title="Quick Actions" description="Need to book a follow-up? Or upload a new report for your doctor to see?" linkText="Book an Appointment" href="/consult" />
        </div>
      </div>
    );
  }

  // --- DOCTOR DASHBOARD ---
  const appointments = [
    { name: 'Liam Johnson', time: '11:00 AM', status: 'Upcoming', avatar: null },
    { name: 'Olivia Smith', time: '11:30 AM', status: 'Upcoming', avatar: null },
    { name: 'Noah Williams', time: '01:00 PM', status: 'Completed', avatar: null },
  ];

  return (
    <div className="space-y-8">
       <div>
          <h1 className="text-4xl font-bold text-slate-800">Dashboard, {user.doctor_name}</h1>
          <p className="mt-2 text-lg text-slate-500">Here is your summary for today, August 17th, 2025.</p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Today's Appointments" value="12" icon={HiOutlineClock} iconBgColor="bg-blue-100" iconColor="text-blue-600" />
        <StatCard title="Unread Messages" value="5" icon={HiOutlineUsers} iconBgColor="bg-amber-100" iconColor="text-amber-600" />
        <StatCard title="Total Patients" value="258" icon={HiOutlineUsers} iconBgColor="bg-green-100" iconColor="text-green-600" />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl text-slate-800">Todays Schedule</h2>
            <Link href="/profile/schedule" className="text-emerald-600 font-semibold text-sm hover:underline">View Full Schedule</Link>
          </div>
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {appointments.map((appt, index) => (
                 <li key={appt.name}>
                    <div className="relative pb-8">
                      {index !== appointments.length - 1 ? (<span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />) : null}
                      <div className="relative flex items-center space-x-3">
                          <div>
                            <span className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white ${appt.status === 'Upcoming' ? 'bg-blue-500' : 'bg-green-500'}`}>
                              <HiOutlineCalendar className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 justify-between items-center md:grid md:grid-cols-3">
                              <div>
                                <p className="text-base font-semibold text-slate-800">{appt.name}</p>
                                <p className="text-sm text-slate-500">{appt.time}</p>
                              </div>
                              <div className="hidden md:block text-center">
                                 <span className={`px-3 py-1 text-xs font-semibold rounded-full ${appt.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{appt.status}</span>
                              </div>
                              <div className="text-right">
                                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full"><HiOutlineDotsVertical/></button>
                              </div>
                          </div>
                      </div>
                    </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
    </div>
  );
}