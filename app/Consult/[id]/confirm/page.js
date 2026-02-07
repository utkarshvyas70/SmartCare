'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDoctor } from '@/app/hooks/useDoctor';
import { useAppointments } from '@/app/hooks/useAppointment';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import { HiOutlineCalendar, HiOutlineClock, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

// A wrapper to handle Suspense for useSearchParams
function ConfirmBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const slot = searchParams.get('slot');

  const { doctor, loading: doctorLoading, getDoctorById, doctorError} = useDoctor();
  const { createAppointment, isLoading: isBooking, error: bookingError } = useAppointments();
  
  useEffect(() => {
    if(!doctorId) return;
    const fetchData = async () => {
      getDoctorById(doctorId);
    };
    fetchData();
  }, [doctorId, getDoctorById]);

  const [reason, setReason] = useState('');
  const [bookingStatus, setBookingStatus] = useState(null);

  const handleConfirm = async () => {
    const result = await createAppointment({
      doctorId,
      slot_start_time: slot,
      reason_for_visit: reason,
    });

    if (result.success) {
      setBookingStatus('success');
      // Redirect to the "My Appointments" page after a short delay
      setTimeout(() => router.push('/profile/appointments'), 2000);
    } else {
      setBookingStatus('error');
    }
  };

  if (doctorLoading) {
    return <div className="animate-pulse h-96 bg-white rounded-xl shadow-sm"></div>;
  }
  if (!doctor || !slot) {
    return <div>Error: Missing booking information.</div>;
  }

  // --- SUCCESS VIEW ---
  if (bookingStatus === 'success') {
    return (
      <div className="text-center">
        <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="mt-4 text-2xl font-bold text-slate-800">Appointment Confirmed!</h2>
        <p className="mt-2 text-slate-500">Your appointment with {doctor.doctor_name} has been successfully booked. You will be redirected shortly.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800">Confirm Your Booking</h1>
      <p className="mt-1 text-slate-500">Please review the details below before confirming your appointment.</p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-sm border">
        <div>
          <p className="text-sm font-semibold text-emerald-600">You are booking with</p>
          <div className="flex items-center gap-4 mt-2">
            <Image src={doctor.profile_photo_url} alt={doctor.doctor_name} width={64} height={64} className="rounded-full object-cover" />
            <div>
              <p className="font-bold text-lg text-slate-800">{doctor.doctor_name}</p>
              <p className="text-sm text-slate-600">{doctor.specialties.join(' • ')}</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-600">Appointment Time</p>
          <div className="mt-2 space-y-2">
            <p className="flex items-center gap-2 font-semibold text-slate-700"><HiOutlineCalendar/> {format(parseISO(slot), 'EEEE, MMMM d, yyyy')}</p>
            <p className="flex items-center gap-2 font-semibold text-slate-700"><HiOutlineClock/> {format(parseISO(slot), 'hh:mm a')}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Reason for Visit (Optional)</label>
        <textarea
          id="reason"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1 form-input"
          placeholder="Briefly describe your symptoms or the reason for this consultation..."
        />
      </div>

      {/* Error display */}
      {bookingStatus === 'error' && bookingError && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm font-semibold rounded-lg flex items-center gap-2">
            <HiExclamationCircle /> {bookingError}
          </div>
      )}
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleConfirm}
          disabled={isBooking}
          className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm disabled:bg-gray-400"
        >
          {isBooking ? 'Confirming...' : 'Confirm & Book Appointment'}
        </button>
      </div>
    </div>
  );
}

// Wrap the main component in Suspense for useSearchParams
export default function ConfirmBookingPage() {
    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <Suspense fallback={<div>Loading...</div>}>
                    <ConfirmBookingContent />
                </Suspense>
            </div>
        </div>
    );
}