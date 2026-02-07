"use client";

import React, { useEffect } from "react";
import { useDoctor } from "@/app/hooks/useDoctor";
import Link from "next/link";
import Image from "next/image";

// Constants to control number of cards visible in slider
const CARDS_VISIBLE_PHONE = 7;
const CARDS_VISIBLE_TABLET = 7;
const CARDS_VISIBLE_DESKTOP = 5;

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Border color for stars to improve visibility
  const starBorderClass = "stroke-gray-500";

  return (
    <div
      className="flex items-center text-yellow-400"
      aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className={`w-4 h-4 fill-current ${starBorderClass}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
          stroke="currentColor"
          strokeWidth={0.8}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg
          key="half"
          className={`w-4 h-4 fill-current`}
          viewBox="0 0 24 24"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2V17.27Z" fill="currentColor" />
          <path
            d="M12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27V2Z"
            fill="#6B7280"
          />
        </svg>
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 fill-current text-gray-500"
          viewBox="0 0 24 24"
          aria-hidden="true"
          stroke="currentColor"
          strokeWidth={0.8}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

const DoctorCard = ({ doctor, cardHeight }) => {
  // Specialties max 2 with "+N more" if applicable (to keep cleanliness)
  let displayedSpecialties = [];
  let moreCount = 0;
  if (Array.isArray(doctor.specialties) && doctor.specialties.length > 0) {
    displayedSpecialties = doctor.specialties.slice(0, 2);
    moreCount = doctor.specialties.length - displayedSpecialties.length;
  }

  return (
    <article
      tabIndex={0}
      aria-label={`Doctor profile card for ${doctor.doctor_name}`}
      className="bg-white rounded-xl shadow-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col group focus:outline-none focus:ring-2 focus:ring-emerald-500 overflow-hidden"
      style={{
        height: cardHeight,
        minHeight: cardHeight,
        maxHeight: cardHeight,
      }}
    >
      {/* Image container */}
      <div
        className="relative bg-gray-100 overflow-hidden rounded-t-xl group-hover:scale-105 transition-transform duration-500"
        style={{ height: `${cardHeight * 0.48}px`, minHeight: `${cardHeight * 0.48}px` }}
      >
        <div className="relative w-full h-40 overflow-hidden rounded-t-3xl shadow-inner">
          <Image
            src={doctor.profile_photo_url}
            alt={`Photo of ${doctor.doctor_name}`}
            fill
            style={{ objectFit: "cover", objectPosition:"top" }}
            priority
          />
        </div>
        <div className="absolute mx-auto bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/75 to-transparent">
          <Link
            href={`/Doctors/${doctor.profile_id}`}
            className="text-white text-lg font-semibold font-montserrat truncate hover:underline"
            aria-label={`View profile of ${doctor.doctor_name}`}
          >
            {doctor.doctor_name}
          </Link>
        </div>
      </div>

      {/* Info & controls */}
      <div
        className="p-4 flex flex-col flex-grow"
        style={{ height: `${cardHeight * 0.52}px`, minHeight: `${cardHeight * 0.52}px` }}
      >
        <div
          className="flex flex-wrap gap-2 mb-3"
          aria-label="Specialties"
          title={
            doctor.specialties && doctor.specialties.length > 0
              ? doctor.specialties.join(", ")
              : "Specialist"
          }
        >
          {displayedSpecialties.map((spec, i) => (
            <span
              key={i}
              className="bg-[#94edb2dc] text-teal-800 text-xs font-semibold font-lato px-2 py-0.5 rounded-full shadow-sm truncate"
            >
              {spec}
            </span>
          ))}
          {moreCount > 0 && (
            <span className="bg-teal-300 text-teal-800 text-xs font-semibold font-lato px-2 py-0.5 rounded-full shadow-sm">
              +{moreCount} more
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <StarRating rating={doctor.average_rating || 0} />
          <span className="text-gray-900 font-semibold text-sm font-lato">
            {(doctor.average_rating || 0).toFixed(1)}
          </span>
          <span className="text-gray-500 text-xs font-lato">
            ({doctor.rating_count || 0} reviews)
          </span>
        </div>

        <Link
          href={`/Consult/${doctor.profile_id}`}
          className="mt-auto block bg-[#005543dd] text-white py-2 rounded-md font-semibold text-center hover:bg-[#257a5fe9] transition"
          aria-label={`Book appointment with ${doctor.doctor_name}`}
        >
          Book Now
        </Link>
      </div>
    </article>
  );
};

export default function TopDoctorsSection() {
  const { doctors, loading, error, getDoctors } = useDoctor();

  useEffect(() => {
    getDoctors();
  }, [getDoctors]);

  if (loading)
    return (
      <p className="text-center py-20 text-emerald-700 font-semibold">
        Loading top doctors...
      </p>
    );

  if (error)
    return (
      <p className="text-center py-20 text-red-600 font-semibold">{error}</p>
    );

  if (!doctors || doctors.length === 0)
    return (
      <p className="text-center py-20 text-gray-700">No doctors available.</p>
    );

  // Sort by rating count descending and take top 8
  const topDoctors = [...doctors]
    .sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0))
    .slice(0, 8);

  // Heights adjusted for devices
  const CARD_HEIGHT_MOBILE = 320; // px, smaller height on phones
  const CARD_HEIGHT_DESKTOP = 360; // px, for tablet and desktop

  return (
    <section
      className="bg-gray-50/80 font-sans"
      aria-label="Top doctors section"
    >
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-montserrat font-extrabold text-gray-900 tracking-tight">
              Meet Our Top Doctors
            </h2>
            <p className="mt-1 text-lg text-gray-600 max-w-xl">
              Professionals dedicated to your well-being.
            </p>
          </div>
          {/* Desktop View All Link */}
          <Link
            href="/Consult"
            className="hidden text-lg py-2 px-3 rounded-3xl md:inline-flex items-center text-[#005543dd] font-semibold hover:text-[#257a5fe9] transition group"
            aria-label="View all doctors"
          >
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Mobile slider: show 5 cards under sm, 7 cards between sm and lg */}
        <div
          className="flex overflow-x-auto space-x-4 px-4 py-4 -mx-4 sm:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
          aria-label="Scrollable top doctors on mobile"
        >
          {topDoctors.slice(0, CARDS_VISIBLE_PHONE).map((doctor) => (
            <div key={doctor.profile_id} className="flex-shrink-0 w-[220px]">
              <DoctorCard doctor={doctor} cardHeight={CARD_HEIGHT_MOBILE} />
            </div>
          ))}
        </div>

        <div
          className="hidden sm:flex overflow-x-auto space-x-4 px-4 -mx-4 md:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
          aria-label="Scrollable top doctors on tablet"
        >
          {topDoctors.slice(0, CARDS_VISIBLE_TABLET).map((doctor) => (
            <div key={doctor.profile_id} className="flex-shrink-0 w-[220px]">
              <DoctorCard doctor={doctor} cardHeight={CARD_HEIGHT_DESKTOP} />
            </div>
          ))}
        </div>

        {/* Desktop grid */}
        <div
          className="hidden md:grid md:grid-cols-5 md:gap-6"
          aria-label="Top doctors grid on desktop"
        >
          {topDoctors.slice(0, CARDS_VISIBLE_DESKTOP).map((doctor) => (
            <DoctorCard key={doctor.profile_id} doctor={doctor} cardHeight={CARD_HEIGHT_DESKTOP} />
          ))}
        </div>

        {/* Mobile-only View All link */}
        <div className="sm:hidden text-center mt-6">
          <Link
            href="/Consult"
            className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-800 transition group"
            aria-label="View all doctors"
          >
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
