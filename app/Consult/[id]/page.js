'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/hooks/useUser';
import { useAppointments } from '@/app/hooks/useAppointment';
import { useDoctor } from '@/app/hooks/useDoctor';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isBefore, 
  startOfDay, eachDayOfInterval, isSameMonth, parse, addMinutes, addHours
} from 'date-fns';
import { HiChevronLeft, HiChevronRight, HiOutlineClock, HiX, HiOutlineCalendar } from 'react-icons/hi';


// --- Professional, Self-Contained Sub-components ---


function DoctorHeader({ doctor }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <Image src={doctor.profile_photo_url} alt={doctor.doctor_name} width={80} height={80} className="rounded-full object-cover w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0" />
      <div>
        <p className="text-sm font-semibold text-emerald-600 text-center sm:text-left">Booking an appointment with</p>
        <Link
            href={`/Doctors/${doctor.profile_id}`}
            className="text-lg font-lato truncate hover:underline sm:text-3xl font-bold text-slate-800 text-center sm:text-left"
            aria-label={`View profile of ${doctor.doctor_name}`}
          >
            {doctor.doctor_name}
        </Link>
        <p className="mt-1 text-base text-slate-500 text-center sm:text-left">{doctor.specialties.join(' • ')}</p>
      </div>
    </div>
  );
}


function Calendar({ currentDate, setCurrentDate, availableDays, activeMonth, setActiveMonth, bookingHorizonDate }) {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const daysInGrid = eachDayOfInterval({
    start: startOfWeek(startOfMonth(activeMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(activeMonth), { weekStartsOn: 1 }),
  });

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setActiveMonth(prev => addDays(prev, -30))} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Previous month">
          <HiChevronLeft className="w-6 h-6 text-gray-500" />
        </button>
        <h3 className="text-lg font-semibold text-slate-800">{format(activeMonth, 'MMMM yyyy')}</h3>
        <button onClick={() => setActiveMonth(prev => addDays(prev, 30))} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Next month">
          <HiChevronRight className="w-6 h-6 text-gray-500" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm text-slate-500 font-medium">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {daysInGrid.map((day, index) => {
          if (!isSameMonth(day, activeMonth)) {
            return <div key={index} className="h-12"></div>;
          }

          const isSelected = isSameDay(day, currentDate);
          const isPast = isBefore(day, startOfDay(new Date()));
          
          // NEW LOGIC: Check if the day is beyond the booking horizon.
          const isBeyondHorizon = isBefore(bookingHorizonDate, day);

          const isAvailable = availableDays.has(format(day, 'yyyy-MM-dd'));
          
          const isDisabled = isPast || isBeyondHorizon || !isAvailable;

          // Refined classes to handle the new `isBeyondHorizon` state
          const dayClasses = `
            w-full h-12 flex items-center justify-center rounded-full text-sm transition-colors relative
            ${isSelected 
              ? 'bg-emerald-600 text-white font-bold shadow-md' 
              : ''
            }
            ${!isSelected && isPast 
              ? 'text-slate-300 cursor-not-allowed' 
              : ''
            }
            ${!isSelected && !isPast && isAvailable && !isSameDay(day, new Date()) 
              ? 'text-slate-700 cursor-pointer hover:bg-emerald-100' 
              : ''
            }
            ${!isSelected && !isPast && !isAvailable && !isSameDay(day, new Date()) 
              ? 'text-slate-400 cursor-not-allowed' 
              : ''
            }
            ${!isSelected && isSameDay(day, new Date()) 
              ? 'ring-2 ring-emerald-500 text-emerald-600'
              : ''
            }
          `;
          
          return (
            <button key={day.toString()} disabled={isDisabled} onClick={() => setCurrentDate(day)} className={dayClasses}>
              {format(day, 'd')}
              {isAvailable && !isPast && !isBeyondHorizon && 
                <span className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`}></span>
              }
            </button>
          );
        })}
      </div>
    </div>
  );
}




function TimeSlotList({ selectedDate, schedule, bookedSlots, onSlotSelect, isLoading }) {

  const dayName = format(selectedDate, 'eeee').toLowerCase();
  const workIntervals = schedule.weekly_availability[dayName] || [];
  
  const generateSlots = (start, end, duration) => {
    const slots = []; let currentTime = parse(start, 'HH:mm', new Date()); const endTime = parse(end, 'HH:mm', new Date());
    while (currentTime < endTime) { slots.push(currentTime); currentTime = addMinutes(currentTime, duration); }
    return slots;
  };
  
  const potentialSlots = workIntervals.flatMap(interval => 
    generateSlots(interval.start, interval.end, schedule.slot_duration_minutes)
  );

  const bookedTimes = new Set(bookedSlots.map(slot => format(new Date(slot), 'HH:mm')));

  const availableSlots = potentialSlots.filter(slot => {
    const slotTime = format(slot, 'HH:mm');
    return !bookedTimes.has(slotTime);
  });

  // --- Grouping Logic (unchanged and correct) ---
  const groupSlots = (slots) => {
    const groups = { Morning: [], Afternoon: [], Evening: [] };
    slots.forEach(slot => {
      const hour = slot.getHours();
      if (hour < 12) groups.Morning.push(slot);
      else if (hour < 17) groups.Afternoon.push(slot);
      else groups.Evening.push(slot);
    });
    return groups;
  };

  const groupedSlots = groupSlots(availableSlots);
  const leadTimeCutoff = addHours(new Date(), schedule.lead_time_hours);

  if (isLoading) {
    return <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 h-full flex items-center justify-center"><p>Loading available slots...</p></div>;
  }

  return (

    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 h-h-[510px] lg:h-[410px] flex flex-col">
      <h3 className="text-lg font-lato font-semibold text-slate-800 flex-shrink-0">
        Select a Time for <span className="text-emerald-600">{format(selectedDate, 'EEEE, MMMM d')}</span>
      </h3>

      {potentialSlots.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 p-4">
          <HiOutlineCalendar className="w-16 h-16 text-gray-300" />
          <p className="mt-4 font-semibold text-base text-slate-700">No Appointments Available</p>
          <p className="mt-1 text-sm">The doctor is not available on this day. Please select another date from the calendar.</p>
        </div>
      ) : (
        <div className="mt-4 flex-grow overflow-y-auto space-y-4 pr-2 -mr-2 styled-scrollbar">
          {Object.entries(groupedSlots).map(([groupName, slots]) => {
            if (slots.length === 0) return null;
            
            return (
              <div key={groupName}>
                <h4 className="font-semibold text-sm text-slate-500 mb-2">{groupName}</h4>
                <div className="space-y-3">
                  {slots.map(slot => {
                    const slotDateTime = parse(format(slot, 'HH:mm'), 'HH:mm', selectedDate);
                    const isWithinLeadTime = isBefore(slotDateTime, leadTimeCutoff);
                    const isDisabled = isWithinLeadTime;
                    const slotStartTime = format(slot, 'HH:mm');
                    const slotEndTime = addMinutes(slot, schedule.slot_duration_minutes);

                    return (
                      <div
                        key={slotStartTime}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg transition-all duration-200 border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50"
                      >
                        <div>
                          <p className="font-bold text-lg text-slate-800">
                            {format(slot, 'hh:mm a')} - {format(slotEndTime, 'hh:mm a')}
                          </p>
                          <p className="text-[13px] text-slate-500">
                            {schedule.slot_duration_minutes} min session
                          </p>
                        </div>
                        <div className="mt-3 sm:mt-0">
                          {!isDisabled ? (
                            <button 
                            onClick={() => onSlotSelect(slot)} 
                            className="px-5 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-full hover:bg-emerald-700 shadow-sm transition transform hover:scale-105"
                            aria-label={`Book appointment for ${format(slot, 'hh:mm a')}`}
                          >
                              Book Appointment
                            </button>
                          ) : (
                            <span className="px-4 py-2 text-sm font-bold text-gray-500">
                              Too Soon
                            </span>
                          )}
                        </div>
                      </div>
                    );
                    
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}




function ConfirmationModal({ slot, date, doctor, onConfirm, onCancel }) {
  if (!slot) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
          <button onClick={onCancel} className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600"><HiX/></button>
          <h2 className="text-xl font-bold text-slate-800">Confirm Your Appointment</h2>
          <p className="text-slate-500 mt-2">You are booking an appointment with:</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <p className="font-bold text-lg text-slate-800">{doctor.doctor_name}</p>
            <p className="text-sm text-slate-600">{doctor.specialties.join(' • ')}</p>
            <div className="mt-2 flex items-center gap-4 text-base font-semibold text-emerald-700">
              <span className="flex items-center gap-2"><HiOutlineCalendar/> {format(date, 'EEEE, MMMM d')}</span>
              <span className="flex items-center gap-2"><HiOutlineClock/> {format(slot, 'hh:mm a')}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">Cancel</button>
            <button onClick={onConfirm} className="px-6 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Confirm Booking</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}




// --- Main Booking Page Component ---
export default function BookingPage({ params }) {
  const { id: doctorId } = params;
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  
  // Use your real custom hooks for data fetching
  const { doctor, doctorLoading, doctorError, getDoctorById } = useDoctor();
  const { bookedAppointments, fetchAppointmentsByDate, isLoading: appointmentsLoading } = useAppointments();
  
  const [schedule, setSchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [activeMonth, setActiveMonth] = useState(startOfDay(new Date()));

  useEffect(() => {
    if (!doctorId) return;
    const fetchSchedule = async () => {
      setScheduleLoading(true);
      try {
        getDoctorById(doctorId);
        const response = await fetch(`/api/schedule/${doctorId}`); // Corrected API path
        if (!response.ok) throw new Error("Failed to fetch schedule.");
        setSchedule(await response.json());
      } catch (error) {
        console.error(error);
      } finally {
        setScheduleLoading(false);
      }
    };
    fetchSchedule();
  }, [doctorId]);

  useEffect(() => {
    if (doctorId && selectedDate) {
      fetchAppointmentsByDate(doctorId, selectedDate);
    }
  }, [doctorId, selectedDate, fetchAppointmentsByDate]);


  const bookingHorizonDate = useMemo(() => {
    if (!schedule) return addDays(new Date(), 30); 
    return addDays(new Date(), schedule.booking_horizon_days);
  }, [schedule]);


  const availableDays = useMemo(() => {
    if (!schedule) return new Set();
    const available = new Set();
    const today = startOfDay(new Date());
    const limitDate = addDays(today, schedule.booking_horizon_days);
    
    const interval = { start: today, end: limitDate };


    eachDayOfInterval(interval).forEach(date => {
      const dayName = format(date, 'eeee').toLowerCase();
      const dateString = format(date, 'yyyy-MM-dd');
      const isWorkingDay = schedule.weekly_availability[dayName]?.length > 0;
      const isUnavailable = schedule.unavailable_dates?.includes(dateString);
      if (isWorkingDay && !isUnavailable) available.add(dateString);
    });
    return available;
  }, [schedule]);

  
   const handleSlotSelect = (slot) => {
    const finalSlotDateTime = new Date(selectedDate);
    finalSlotDateTime.setHours(slot.getHours());
    finalSlotDateTime.setMinutes(slot.getMinutes());
    finalSlotDateTime.setSeconds(0);
    finalSlotDateTime.setMilliseconds(0);

    const query = new URLSearchParams({
      doctorId,
      slot: finalSlotDateTime.toISOString(), // Pass the FULL, correct ISO string
    });
    router.push(`/Consult/${doctorId}/confirm?${query.toString()}`);
  };


  if (userLoading || !doctor || !schedule) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-pulse">
          <div className="h-36 bg-white rounded-xl shadow-sm"></div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 h-96 bg-white rounded-xl shadow-sm"></div>
            <div className="lg:col-span-3 h-96 bg-white rounded-xl shadow-sm"></div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        <DoctorHeader doctor={doctor} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            {/* THE FIX IS HERE: The `setSelectedDate` function is correctly passed as the `setCurrentDate` prop. */}
            <Calendar 
              currentDate={selectedDate} 
              setCurrentDate={setSelectedDate}
              availableDays={availableDays}
              activeMonth={activeMonth}
              setActiveMonth={setActiveMonth}
              bookingHorizonDate={bookingHorizonDate}
            />
          </div>
          <div className="lg:col-span-3">
            <TimeSlotList 
              selectedDate={selectedDate}
              schedule={schedule}
              bookedSlots={bookedAppointments}
              onSlotSelect={handleSlotSelect}
              doctor = {doctor}
              isLoading = {scheduleLoading}
            />
          </div>
        </div>

      </div>
    </div>
  );
}