"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDoctor } from "@/app/hooks/useDoctor";
import Link from "next/link";
import Image from "next/image";

// --- ICON COMPONENTS ---
const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
    </svg>
);

const FilterIcon = () => (
    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 019 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
);

const ChevronDownIcon = ({ isOpen }) => (
    <svg className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

// --- CARD COMPONENTS (Unchanged) ---
const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center text-yellow-400" aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`} role="img">
            {[...Array(fullStars)].map((_, i) => (
                <svg key={`full-${i}`} className="w-4 h-4 fill-current stroke-gray-500" viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth={0.8}>
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}
            {hasHalfStar && (
                <svg key="half" className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2V17.27Z" fill="currentColor" />
                    <path d="M12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27V2Z" fill="#6B7280" />
                </svg>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <svg key={`empty-${i}`} className="w-4 h-4 fill-current text-gray-500" viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth={0.8}>
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}
        </div>
    );
};

const DoctorCard = ({ doctor, cardHeight = 360 }) => {
    const displayedSpecialties = doctor.specialties?.slice(0, 2) || [];
    const moreCount = Math.max(0, (doctor.specialties?.length || 0) - displayedSpecialties.length);

    return (
        <article
            tabIndex={0}
            aria-label={`Doctor profile card for ${doctor.doctor_name}`}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 overflow-hidden"
            style={{ height: cardHeight, minHeight: cardHeight, maxHeight: cardHeight }}
        >
            <div className="relative bg-gray-100 overflow-hidden rounded-t-xl group-hover:scale-105 transition-transform duration-500" style={{ height: `${cardHeight * 0.48}px`, minHeight: `${cardHeight * 0.48}px` }}>
                <div className="relative w-full h-full">
                    <Image src={doctor.profile_photo_url} alt={`Photo of ${doctor.doctor_name}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: "cover", objectPosition: "top" }} priority />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 mx-auto bg-gradient-to-t from-black/80 to-transparent">
                    <Link href={`/Doctors/${doctor.profile_id}`} className="text-white text-lg font-semibold font-montserrat truncate hover:underline" aria-label={`View profile of ${doctor.doctor_name}`}>
                        {doctor.doctor_name}
                    </Link>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow" style={{ height: `${cardHeight * 0.52}px`, minHeight: `${cardHeight * 0.52}px` }}>
                <div className="flex flex-wrap gap-2 mb-3" aria-label="Specialties" title={doctor.specialties?.join(", ") || "Specialist"}>
                    {displayedSpecialties.map((spec, i) => <span key={i} className="bg-teal-100 text-teal-800 text-xs font-semibold font-lato px-2 py-0.5 rounded-full shadow-sm truncate">{spec}</span>)}
                    {moreCount > 0 && <span className="bg-gray-200 text-gray-700 text-xs font-semibold font-lato px-2 py-0.5 rounded-full shadow-sm">+{moreCount} more</span>}
                </div>
                <div className="flex items-center space-x-2 mb-4">
                    <StarRating rating={doctor.average_rating || 0} />
                    <span className="text-gray-900 font-semibold text-sm font-lato">{(doctor.average_rating || 0).toFixed(1)}</span>
                    <span className="text-gray-500 text-xs font-lato">({doctor.rating_count || 0} reviews)</span>
                </div>
                <Link href={`/Consult/${doctor.profile_id}`} className="mt-auto block bg-[#005543dd] text-white py-2 rounded-lg font-semibold text-center hover:bg-[#004a3a] transition" aria-label={`Book appointment with ${doctor.doctor_name}`}>
                    Book Now
                </Link>
            </div>
        </article>
    );
};


// --- MAIN PAGE COMPONENT ---
export default function AllDoctorsPage() {
    const { doctors, loading, error, getDoctors } = useDoctor();
    const [searchQuery, setSearchQuery] = useState("");
    const [specialtyFilter, setSpecialtyFilter] = useState("all");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch doctors on component mount
    useEffect(() => { getDoctors(); }, [getDoctors]);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);


    const allSpecialties = useMemo(() => {
        if (!doctors) return [];
        const specialtySet = new Set(doctors.flatMap(doc => doc.specialties || []));
        return ["All Specialties", ...Array.from(specialtySet).sort()];
    }, [doctors]);
    
    const selectedSpecialtyLabel = specialtyFilter === 'all' ? 'All Specialties' : specialtyFilter;

    const filteredDoctors = useMemo(() => {
        if (!doctors) return [];
        return doctors.filter((doc) => {
            const nameMatch = doc.doctor_name.toLowerCase().includes(searchQuery.toLowerCase());
            const specialtyMatch = specialtyFilter === 'all' || (doc.specialties && doc.specialties.includes(specialtyFilter));
            return nameMatch && specialtyMatch;
        });
    }, [doctors, searchQuery, specialtyFilter]);

    const handleSpecialtySelect = (spec) => {
        setSpecialtyFilter(spec === 'All Specialties' ? 'all' : spec);
        setIsDropdownOpen(false);
    }
    

    if (loading) return <p className="flex justify-center items-center h-screen text-teal-700 font-semibold text-lg">Loading doctors...</p>;
    if (error) return <p className="flex justify-center items-center h-screen text-red-600 font-semibold text-lg">{error}</p>;

    return (
        <section className="bg-[#F8FBFB] font-sans min-h-screen" aria-label="All doctors listing">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:pt-8 md:pb-24">

                {/* --- HEADER & FILTERS --- */}
                <header className="mb-10 md:mb-12">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-teal-900 font-montserrat">Find Your Doctor</h1>
                        <p className="text-base text-gray-600 mt-2 font-lato">Search by name or filter by medical specialty below.</p>
                    </div>

                    <div className="w-full flex flex-col md:flex-row items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-3/4">
                            <label htmlFor="doctor-search" className="sr-only">Search by name</label>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input id="doctor-search" type="search" placeholder="Search by name, e.g., Dr. Emily Carter" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-lg border-[1px] border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-lato text-gray-800 transition" autoComplete="off" />
                        </div>

                        <div className="relative w-full md:w-1/4" ref={dropdownRef}>
                            <label htmlFor="specialty-filter-button" className="sr-only">Filter by specialty</label>
                            <button
                                id="specialty-filter-button"
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex items-center justify-between pl-12 pr-4 py-3 rounded-lg border-[1px] border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-lato text-gray-800 transition text-left"
                                aria-haspopup="listbox"
                                aria-expanded={isDropdownOpen}
                            >
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><FilterIcon /></span>
                                <span className="truncate">{selectedSpecialtyLabel}</span>
                                <span className="pointer-events-none"><ChevronDownIcon isOpen={isDropdownOpen}/></span>
                            </button>

                            {isDropdownOpen && (
                                <ul
                                    className="absolute z-10 mt-1 w-5/6 bg-white shadow-lg rounded-md py-1 text-lg ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm max-h-60"
                                    tabIndex={-1}
                                    role="listbox"
                                    aria-labelledby="specialty-filter-button"
                                >
                                    {allSpecialties.map((spec) => (
                                        <li
                                            key={spec}
                                            onClick={() => handleSpecialtySelect(spec)}
                                            className="text-gray-900 font-lato cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-teal-50"
                                            role="option"
                                            aria-selected={spec === selectedSpecialtyLabel}
                                        >
                                            <span className={`block truncate ${spec === selectedSpecialtyLabel ? 'font-semibold' : 'font-normal'}`}>
                                                {spec}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </header>

                {/* --- DOCTORS GRID --- */}
                {filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 xl:gap-8">
                        {filteredDoctors.map((doctor) => (
                            <DoctorCard key={doctor.profile_id} doctor={doctor} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
                        <h2 className="text-xl font-semibold text-gray-700 font-montserrat">No Matching Doctors Found</h2>
                        <p className="text-gray-500 mt-2 font-lato">Please try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </section>
    );
}