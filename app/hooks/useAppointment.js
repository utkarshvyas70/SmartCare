import { useState, useCallback } from 'react';
import { format } from 'date-fns';

export function useAppointments() {
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [appointments, setAppointments] = useState([]); // Will hold ALL user appointments


  const fetchUserAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // This API route needs to be created. It will check the user's session
      // and return appointments where the user is either the patient or the doctor.
      const response = await fetch('/api/appointments/user'); 
      if (!response.ok) throw new Error('Failed to fetch appointments.');
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const fetchAppointmentsByDate = useCallback(async (doctorId, date) => {
    if (!doctorId || !date) {
      return;
    }
    setIsLoading(true);
    setError(null);
    const dateString = format(date, 'yyyy-MM-dd');
    try {
      const response = await fetch(`/api/appointments/bydate?doctorId=${doctorId}&date=${dateString}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch appointments: ${response.statusText}`);
      }

      const data = await response.json();
      setBookedAppointments(data);

    } catch (err) {
      console.error("useAppointments Error:", err);
      setError(err.message);
      setBookedAppointments([]); 
    } finally {
      setIsLoading(false);
    }
  }, []);



  const createAppointment = useCallback(async (bookingDetails) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create appointment.');
      }

      return { success: true, data };

    } catch (err) {
      console.error("createAppointment Error:", err);
      setError(err.message);
      return { success: false, error: err.message }; // Return error details
    } finally {
      setIsLoading(false);
    }
  }, []);


  const cancelAppointment = useCallback(async (appointmentId) => {
    // We don't set loading here to provide a more optimistic UI feel
    setError(null);
    try {
      const response = await fetch('/api/appointments/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to cancel appointment.');

      // IMPORTANT: After successfully cancelling, update the local state
      // to instantly reflect the change in the UI without a full page reload.
      setAppointments(prev =>
        prev.map(appt =>
          appt.id === appointmentId ? { ...appt, status: data.newStatus || 'Cancelled' } : appt
        )
      );
      return { success: true, message: data.message };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  

  return { 
    bookedAppointments, 
    isLoading, 
    error,
    appointments,
    fetchUserAppointments,
    fetchAppointmentsByDate,
    createAppointment, 
    cancelAppointment,
  };
}