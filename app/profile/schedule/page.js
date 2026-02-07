'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/hooks/useUser';
import { useAppointments } from '@/app/hooks/useAppointment'; // We'll need cancelAppointment
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTrash, HiPlus, HiExclamation, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import { format, parseISO } from 'date-fns';

// --- Reusable UI Components for the Form ---
function FormCard({ title, description, children }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
            <div className="mt-6 border-t border-gray-200 pt-6">
                {children}
            </div>
        </div>
    );
}


function WeeklyAvailabilityEditor({ availability, setAvailability }) {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const handleToggleDay = (day) => {
        const newAvailability = { ...availability };
        if (newAvailability[day].length > 0) {
            newAvailability[day] = []; // Toggle off
        } else {
            newAvailability[day] = [{ start: '09:00', end: '17:00' }]; // Toggle on with a default
        }
        setAvailability(newAvailability);
    };

    const handleTimeChange = (day, index, field, value) => {
        const newAvailability = { ...availability };
        newAvailability[day][index][field] = value;
        setAvailability(newAvailability);
    };

    const handleAddInterval = (day) => {
        const newAvailability = { ...availability };
        newAvailability[day].push({ start: '13:00', end: '17:00' });
        setAvailability(newAvailability);
    };

    const handleRemoveInterval = (day, index) => {
        const newAvailability = { ...availability };
        newAvailability[day].splice(index, 1);
        // If it's the last interval, toggle the day off
        if (newAvailability[day].length === 0) {
            // This is optional but good UX
        }
        setAvailability(newAvailability);
    };

    return (
        <div className="space-y-4">
            {daysOfWeek.map(day => {
                const dayIntervals = availability[day] || [];
                const isDayActive = dayIntervals.length > 0;

                return (
                    <div key={day} className="grid grid-cols-12 gap-4 items-start py-4 border-b border-gray-100 last:border-b-0">
                        {/* Day and Toggle */}
                        <div className="col-span-12 sm:col-span-3 flex items-center justify-between sm:justify-start sm:gap-4">
                            <h4 className="font-bold text-slate-700 capitalize w-20">{day}</h4>
                            <button
                                type="button"
                                onClick={() => handleToggleDay(day)}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${isDayActive ? 'bg-emerald-600' : 'bg-gray-200'}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isDayActive ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        {/* Time Slots */}
                        <div className="col-span-12 sm:col-span-9">
                            <AnimatePresence>
                                {!isDayActive ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center h-full">
                                        <p className="text-sm text-slate-400 font-medium">Unavailable</p>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                                        {dayIntervals.map((interval, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <input type="time" value={interval.start} onChange={e => handleTimeChange(day, index, 'start', e.target.value)} className="form-input w-full"/>
                                                <span className="text-gray-500 font-semibold text-sm">to</span>
                                                <input type="time" value={interval.end} onChange={e => handleTimeChange(day, index, 'end', e.target.value)} className="form-input w-full"/>
                                                <button type="button" onClick={() => handleRemoveInterval(day, index)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-50">
                                                    <HiOutlineTrash className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => handleAddInterval(day)} className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-800">
                                            <HiPlus/> Add Break
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


// --- Conflict Resolution Modal ---
function ConflictModal({ conflicts, onConfirmCancel, onAbort, isCancelling }) {
    if (!conflicts || conflicts.length === 0) return null;
    
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onAbort} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100"><HiExclamation className="h-6 w-6 text-red-600"/></div>
                    <h2 className="mt-4 text-xl font-bold text-slate-800">Schedule Conflict</h2>
                    <p className="mt-2 text-sm text-slate-500">Your new schedule conflicts with {conflicts.length} pre-booked appointments. To save your changes, these appointments must be cancelled, and patients will be notified.</p>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg max-h-48 overflow-y-auto space-y-2 border">
                    {conflicts.map(appt => (
                        <div key={appt.id} className="text-sm">
                            <p className="font-semibold text-gray-600">{format(parseISO(appt.slot_start_time), 'EEEE, MMM d @ hh:mm a')}</p>
                            {/* In a real app, you'd fetch and show the patient's name here */}
                        </div>
                    ))}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button type="button" onClick={onAbort} className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">Dont Save</button>
                    <button type="button" onClick={onConfirmCancel} disabled={isCancelling} className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300">
                        {isCancelling ? 'Cancelling...' : `Cancel ${conflicts.length} Appointments & Save`}
                    </button>
                </div>
            </motion.div>
        </div>
      </AnimatePresence>
    );
}

// --- Main Schedule Management Page ---
export default function SchedulePage() {
    const { user } = useUser();
    const { cancelAppointment } = useAppointments(); // We'll use this to cancel multiple
    const [schedule, setSchedule] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [conflicts, setConflicts] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        if (!user) return;
        const fetchSchedule = async () => {
            // This is the /api/schedules/[doctorId] route we created before
            const res = await fetch(`/api/schedule/${user.id}`);
            const data = await res.json();
            setSchedule(data);
            setIsLoading(false);
        };
        fetchSchedule();
    }, [user]);
    
    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSaveMessage('');

        const res = await fetch('/api/schedule/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(schedule),
        });
        
        const data = await res.json();

        if (res.ok) {
            setSaveMessage(data.message);
        } else if (res.status === 409 && data.conflict) {
            setConflicts(data.conflictedAppointments);
        } else {
            setError(data.error || "Failed to save schedule.");
        }
        setIsSaving(false);
    };

    const handleConfirmCancelAndSave = async () => {
        setIsSaving(true);
        // Cancel all appointments
        const cancellationPromises = conflicts.map(appt => cancelAppointment(appt.id));
        await Promise.all(cancellationPromises);
        
        // Now that appointments are cancelled, re-save the schedule
        // This time, the backend will find no conflicts and succeed.
        setConflicts([]); // Close the modal
        await handleSave();
    };

    if (isLoading || !schedule) {
        return <div className="animate-pulse h-96 bg-white rounded-xl shadow-sm"></div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">Schedule Management</h2>
                <p className="mt-1 text-slate-500">Define your working hours, appointment durations, and booking rules.</p>
            </div>

            <FormCard title="Booking Rules" description="Control how far in advance and how close to the appointment time patients can book.">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Appointment Duration</label>
                        <select value={schedule.slot_duration_minutes} onChange={e => setSchedule({...schedule, slot_duration_minutes: Number(e.target.value)})} className="mt-1 form-input">
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Booking Horizon (days)</label>
                        <input type="number" value={schedule.booking_horizon_days} onChange={e => setSchedule({...schedule, booking_horizon_days: Number(e.target.value)})} className="mt-1 form-input"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Lead Time (hours)</label>
                        <input type="number" value={schedule.lead_time_hours} onChange={e => setSchedule({...schedule, lead_time_hours: Number(e.target.value)})} className="mt-1 form-input"/>
                    </div>
                </div>
            </FormCard>

            <FormCard title="Weekly Availability" description="Set your recurring weekly work hours. Toggle a day on or off, and add multiple time intervals to create breaks.">
                <WeeklyAvailabilityEditor 
                    availability={schedule.weekly_availability}
                    setAvailability={(newAvailability) => setSchedule(prev => ({ ...prev, weekly_availability: newAvailability }))}
                />
            </FormCard>

            {/* A card for `unavailable_dates` would go here, likely using a calendar picker component */}

            <div className="flex justify-end items-center gap-4 border-t border-gray-200 pt-6">
                 {saveMessage && <p className="text-sm font-semibold text-green-600">{saveMessage}</p>}
                 {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
                <button onClick={handleSave} disabled={isSaving} className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 shadow disabled:bg-gray-400">
                    {isSaving ? 'Saving...' : 'Save Schedule Changes'}
                </button>
            </div>
            
            <ConflictModal 
                conflicts={conflicts}
                onConfirmCancel={handleConfirmCancelAndSave}
                onAbort={() => setConflicts([])}
                isCancelling={isSaving}
            />
        </div>
    );
}