"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDoctor } from "@/app/hooks/useDoctor"; 

// --- ICON COMPONENTS ---
const CertificateIcon = () => <svg className="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const EducationIcon = () => <svg className="w-5 h-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422A12.083 12.083 0 0121 18c0 1.933-.833 3.706-2.197 4.975L12 23l-6.803-3.025A7.926 7.926 0 013 18c0-1.933.833-3.706 2.197-4.975L12 14z" /></svg>;
const LanguageIcon = () => <svg className="w-5 h-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m4 1h5l-5.63 7.493a5.525 5.525 0 00-4.37 0L3 11h5" /></svg>;
const ExperienceIcon = () => <svg className="w-5 h-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const VerifiedIcon = () => <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-label="Verified Doctor"> <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /> </svg>;
const PhoneIcon = () => <svg className="w-5 h-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;

const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
    return (
      <div className="flex items-center text-yellow-400" aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`} role="img">
        {[...Array(fullStars)].map((_, i) => <svg key={`full-${i}`} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>)}
        {hasHalfStar && <svg key="half" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27V2L9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor" /><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" fill="rgba(0,0,0,0.2)"/></svg>}
        {[...Array(emptyStars)].map((_, i) => <svg key={`empty-${i}`} className="w-5 h-5 fill-current text-gray-300" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>)}
      </div>
    );
  };

export default function DoctorProfilePage() {
    const params = useParams();
    const { id } = params;   

    const { doctor, doctorLoading, doctorError, getDoctorById } = useDoctor();

    useEffect(() => {
        if (id) {
            getDoctorById(id);
        }
    }, [id, getDoctorById]);

    if (doctorLoading) return <p className="flex justify-center items-center h-screen text-teal-700 font-semibold text-lg">Loading Doctor Profile...</p>;
    if (doctorError) return <p className="flex justify-center items-center h-screen text-red-600 font-semibold text-lg">{doctorError}</p>;
    if (!doctor) return <p className="flex justify-center items-center h-screen text-gray-700">Doctor Not Found.</p>;

    return (
        <main className="bg-[#F8FBFB] font-lato text-gray-800">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:pt-16 md:pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    <div className="lg:col-span-3">
                        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-lg group">
                            <Image src={doctor.profile_photo_url} alt={`${doctor.doctor_name} profile photo`} fill style={{ objectFit: "cover", objectPosition: "top" }} className="transition-transform duration-300 group-hover:scale-105" priority />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 mb-4">
                           <div className="flex items-center gap-3">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-teal-900 font-montserrat">{doctor.doctor_name}</h1>
                                <VerifiedIcon />
                            </div>
                           {doctor.phone_number && (
                                <a href={`tel:${doctor.phone_number}`} className="flex items-center gap-2 text-lg text-teal-700 font-semibold hover:underline">
                                    <PhoneIcon />
                                    <span>{doctor.phone_number}</span>
                                </a>
                           )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {doctor.specialties?.map(spec => (<span key={spec} className="bg-teal-100 text-teal-800 font-semibold text-sm px-3 py-1.5 rounded-full shadow-sm">{spec}</span>))}
                        </div>
                        {doctor.professional_statement && (<p className="mb-8 text-gray-700 leading-relaxed whitespace-pre-line border-l-4 border-teal-500 pl-4">{doctor.professional_statement}</p>)}
                        <div className="space-y-6">
                            {doctor.education?.length > 0 && (<div>
                                <h2 className="text-xl font-bold text-teal-800 flex items-center gap-2 mb-3"><EducationIcon />Education</h2>
                                <ul className="space-y-2 pl-7">
                                    {doctor.education.map((edu, idx) => (<li key={idx}><strong>{edu.degree}</strong> from {edu.school} ({edu.year})</li>))}
                                </ul>
                            </div>)}
                            <div>
                                <h2 className="text-xl font-bold text-teal-800 flex items-center gap-2 mb-3"><ExperienceIcon />Years in Practice</h2>
                                <p className="pl-7">{doctor.years_in_practice ?? "N/A"} years</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-teal-800 flex items-center gap-2 mb-3"><LanguageIcon />Languages Spoken</h2>
                                <p className="pl-7">{doctor.languages_spoken?.join(", ") ?? "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="top-28 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                                <div className="mb-4 flex items-center justify-center space-x-2">
                                    <StarRating rating={doctor.average_rating ?? 0} />
                                    <p className="text-sm text-gray-600">{doctor.average_rating?.toFixed(1) ?? "0.0"} ({doctor.rating_count ?? 0} reviews)</p>
                                </div>
                                <Link href={`/booking?doctorId=${doctor.id}`} className="w-full inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-teal-700 transition-all shadow-md hover:shadow-lg">
                                    Book Appointment
                                </Link>
                                <p className="text-xs text-gray-400 mt-3">Book now for a consultation</p>
                            </div>
                            {doctor.degree_photo_url && (
                                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                                    <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-3"><CertificateIcon />Degree Certificate</h3>
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                        <Image src={doctor.degree_photo_url} alt={`${doctor.doctor_name} degree certificate`} fill style={{ objectFit: "contain" }} className="bg-gray-50 p-2"/>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}