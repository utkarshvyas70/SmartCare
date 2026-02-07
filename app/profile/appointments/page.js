'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/app/hooks/useUser';
import { useAppointments } from '@/app/hooks/useAppointment';
import { format, isBefore, startOfToday, parseISO, differenceInMinutes } from 'date-fns';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineCalendar, HiOutlineClock, HiExclamation, HiVideoCamera, 
  HiOutlineDocumentText, HiOutlineX, HiOutlineShieldExclamation
} from 'react-icons/hi';

// --- Self-Contained Sub-components for a Clean, Professional Structure ---

// A simple hook to get the current time, essential for real-time UI updates.
function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    // Update the time every 30 seconds to refresh the UI's "joinable" state.
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  return currentTime;
}

// The modal for viewing details of a past, completed appointment.
function DetailsModal({ appointment, onClose, role }) {
  if (!appointment) return null;
  const otherParty = role === 'patient' ? appointment.doctor : appointment.patient;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"><HiOutlineX className="w-6 h-6"/></button>
          <h2 className="text-xl font-bold text-slate-800">Appointment Details</h2>
          <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <p className="text-sm font-semibold text-slate-500">{role === 'patient' ? 'Consultation with' : 'Patient'}</p>
              <p className="font-bold text-lg text-slate-800">{role === 'patient' ? otherParty?.doctor_name : otherParty?.patient_name}</p>
              <p className="text-sm text-slate-500">{format(parseISO(appointment.slot_start_time), 'EEEE, MMMM d, yyyy')}</p>
            </div>
            <div className="flex-grow space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Doctors Notes</h3>
                <p className="text-sm text-slate-700 mt-1 p-3 bg-gray-50 rounded-lg min-h-[80px]">
                  {appointment.doctor_notes || "No notes were added for this consultation."}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Prescription</h3>
                <p className="text-sm text-slate-700 mt-1 p-3 bg-gray-50 rounded-lg">
                  No prescription was issued for this consultation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// The professional modal for confirming a cancellation.
function CancellationModal({ appointment, onConfirm, onCancel, isCancelling }) {
  if (!appointment) return null;
  const otherParty = appointment.doctor || appointment.patient;
  const otherPartyName = otherParty?.doctor_name || otherParty?.patient_name;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <HiOutlineShieldExclamation className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-800">Cancel Appointment</h2>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to cancel your appointment with <span className="font-semibold">{otherPartyName}</span> on <span className="font-semibold">{format(parseISO(appointment.slot_start_time), 'MMMM d')}</span> at <span className="font-semibold">{format(parseISO(appointment.slot_start_time), 'hh:mm a')}</span>?
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">Keep Appointment</button>
            <button type="button" onClick={onConfirm} disabled={isCancelling} className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300">
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel It'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// The main card for displaying a single appointment.
function AppointmentCard({ appointment, role, onCancel, onViewDetails, currentTime }) {
  const isPatient = role === 'patient';
  const otherParty = isPatient ? appointment.doctor : appointment.patient;
  
  if (!otherParty) { // A safety guard for rendering
    return <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse min-h-[220px]"></div>;
  }
  
  const startTime = parseISO(appointment.slot_start_time);
  const isPast = isBefore(startTime, currentTime); // Use current time for more accuracy
  const minutesUntilStart = differenceInMinutes(startTime, currentTime);
  const isJoinable = minutesUntilStart <= 10 && minutesUntilStart > -60; // Active from 10 mins before to 60 mins after start

  const statusStyles = {
    Scheduled: 'bg-blue-100 text-blue-800', Completed: 'bg-green-100 text-green-800',
    'Cancelled by Patient': 'bg-red-100 text-red-800', 'Cancelled by Doctor': 'bg-red-100 text-red-800',
    'No Show': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image src={otherParty.profile_photo_url || '/default-avatar.png'} alt={isPatient ? otherParty.doctor_name : otherParty.patient_name} width={56} height={56} className="rounded-full object-cover" />
          <div>
            <p className="text-sm text-slate-500">{isPatient ? 'Consultation with' : 'Appointment for'}</p>
            <p className="font-bold text-lg text-slate-800">{isPatient ? otherParty.doctor_name : otherParty.patient_name}</p>
            {isPatient && <p className="text-sm text-slate-600">{otherParty.specialties?.join(' • ')}</p>}
          </div>
        </div>
        <div className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[appointment.status]}`}>{appointment.status}</div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-x-6 gap-y-2 text-slate-600">
        <span className="flex items-center gap-2 text-sm font-medium"><HiOutlineCalendar/> {format(startTime, 'EEEE, MMMM d, yyyy')}</span>
        <span className="flex items-center gap-2 text-sm font-medium"><HiOutlineClock/> {format(startTime, 'hh:mm a')}</span>
      </div>
      {appointment.reason_for_visit && (
        <div className="mt-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reason for Visit</p>
            <p className="text-sm text-slate-700 mt-1 p-3 bg-gray-50 rounded-lg">{appointment.reason_for_visit}</p>
        </div>
      )}
      <div className="mt-6 flex items-center justify-end gap-3">
        {appointment.status === 'Completed' && <button onClick={() => onViewDetails(appointment)} className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">View Details</button>}
        {appointment.status === 'Scheduled' && !isPast && !isBefore(startTime, startOfToday()) && (
          <>
            <button onClick={() => onCancel(appointment)} className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg">Cancel</button>
            <button disabled={!isJoinable} className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed enabled:hover:bg-emerald-700">Join Call</button>
          </>
        )}
      </div>
    </div>
  );
}

// --- The Main Appointments Page Component ---
export default function AppointmentsPage() {
  const { user } = useUser();
  const { appointments, isLoading, error, fetchUserAppointments, cancelAppointment } = useAppointments();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [selectedAppointmentForDetails, setSelectedAppointmentForDetails] = useState(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const currentTime = useCurrentTime();

  useEffect(() => {
    fetchUserAppointments();
  }, [fetchUserAppointments]);

  const { activeAppointment, upcoming, past, cancelled } = useMemo(() => {
    if (!appointments) return { activeAppointment: null, upcoming: [], past: [], cancelled: [] };

    let activeAppt = null;
    const upcomingAppts = [];
    const pastAppts = [];
    const cancelledAppts = [];

    // Sort appointments to ensure the nearest one is picked as 'active'
    const sortedAppointments = [...appointments].sort((a, b) => new Date(a.slot_start_time) - new Date(b.slot_start_time));

    sortedAppointments.forEach(appt => {
      const startTime = parseISO(appt.slot_start_time);
      const minutesUntilStart = differenceInMinutes(startTime, currentTime);
      const isJoinable = minutesUntilStart <= 10 && minutesUntilStart > -60;

      if (appt.status === 'Scheduled' && isJoinable && !activeAppt) { // Take the first one that's joinable
        activeAppt = appt;
      } else if (appt.status === 'Scheduled' && isBefore(currentTime, startTime)) {
        upcomingAppts.push(appt);
      } else if (appt.status.includes('Cancelled')) {
        cancelledAppts.push(appt);
      } else { // Completed or Scheduled but in the past
        pastAppts.push(appt);
      }
    });

    return { activeAppointment: activeAppt, upcoming: upcomingAppts, past: pastAppts.reverse(), cancelled: cancelledAppts };
  }, [appointments, currentTime]);

  const handleCancelRequest = (appointment) => {
    setAppointmentToCancel(appointment);
  };

  const handleConfirmCancel = async () => {
    if (!appointmentToCancel) return;
    setIsCancelling(true);
    const result = await cancelAppointment(appointmentToCancel.id);
    setIsCancelling(false);
    if (!result.success) {
      alert(`Error: ${result.error}`);
    }
    setAppointmentToCancel(null);
  };

  const tabs = ['Upcoming', 'Past', 'Cancelled'];
  const appointmentsByTab = { Upcoming: upcoming, Past: past, Cancelled: cancelled };
  const filteredAppointments = appointmentsByTab[activeTab];

  return (
    <div className="space-y-8">
      {/* --- Active Appointment Banner --- */}
      {activeAppointment && (
        <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <HiVideoCamera className="w-10 h-10 flex-shrink-0"/>
              <div>
                <h2 className="text-xl font-bold">Your appointment is active!</h2>
                <p className="text-sm opacity-90">
                  With {user?.role === 'patient' ? activeAppointment.doctor.doctor_name : activeAppointment.patient.patient_name} at {format(parseISO(activeAppointment.slot_start_time), 'hh:mm a')}
                </p>
              </div>
            </div>
            <button className="px-6 py-3 font-semibold bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 w-full sm:w-auto transition-colors shadow">Join Call Now</button>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold text-slate-800">{user?.role === 'patient' ? 'My Appointments' : 'My Patients'}</h2>
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">{tabs.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === tab ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{tab}</button>))}
        </nav>
      </div>

      <div>
        {isLoading ? (
          <div className="space-y-4"><div className="h-48 bg-white rounded-xl shadow-sm animate-pulse"></div><div className="h-48 bg-white rounded-xl shadow-sm animate-pulse"></div></div>
        ) : error ? (
           <div className="p-4 bg-red-50 text-red-700 font-medium rounded-lg flex items-center gap-2"><HiExclamation/> {error}</div>
        ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-16"><HiOutlineCalendar className="mx-auto h-12 w-12 text-gray-400"/><h3 className="mt-2 text-sm font-semibold text-gray-900">No {activeTab.toLowerCase()} appointments</h3><p className="mt-1 text-sm text-gray-500">You currently have no appointments in this category.</p></div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map(appt => (
              <AppointmentCard key={appt.id} appointment={appt} role={user?.role} onCancel={handleCancelRequest} onViewDetails={setSelectedAppointmentForDetails} currentTime={currentTime}/>
            ))}
          </div>
        )}
      </div>

      <DetailsModal appointment={selectedAppointmentForDetails} onClose={() => setSelectedAppointmentForDetails(null)} role={user?.role} />
      <CancellationModal appointment={appointmentToCancel} onConfirm={handleConfirmCancel} onCancel={() => setAppointmentToCancel(null)} isCancelling={isCancelling}/>
    </div>
  );
}