import { useState, useCallback } from "react";

export function useDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [doctor, setDoctor] = useState(null);      
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorError, setDoctorError] = useState(null);

  const getDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/doctor/all", { method: "GET" });
      const json = await res.json();
      if (json.success) {
        setDoctors(json.data || []);
      } else {
        setDoctors([]);
        setError(json.message || "Failed to fetch doctors");
      }
    } catch (err) {
      setDoctors([]);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);




  const getDoctorById = useCallback(async (id) => {
    if (!id) {
      setDoctor(null);
      setDoctorError("Invalid doctor ID");
      return;
    }
    setDoctorLoading(true);
    setDoctorError(null);
    try {
      const res = await fetch(`/api/doctor/${id}`, { method: "GET" });
      const json = await res.json();
      if (json.success) {
        setDoctor(json.data);
      } else {
        setDoctor(null);
        setDoctorError(json.message || "Doctor not found");
      }
    } catch (err) {
      setDoctor(null);
      setDoctorError("Network error");
    } finally {
      setDoctorLoading(false);
    }
  }, []);

  return {
    doctors,
    loading,
    error,
    getDoctors,
    doctor,
    doctorLoading,
    doctorError,
    getDoctorById,
  };
}
