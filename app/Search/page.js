"use client";

import React, { Suspense, useEffect, useState } from "react";
import Search2 from "@/components/search2";
import { useSearchParams } from "next/navigation";
import {FaCircle,FaCapsules,FaHeartbeat,FaShieldAlt,FaStethoscope} from "react-icons/fa";

function TopRightDecoration() {
  return (
    <svg
      width={120}
      height={75}
      viewBox="0 0 115 68"
      fill="none"
      className="absolute right-8 top-8 hidden md:block"
      aria-hidden="true"
      focusable="false"
      style={{ opacity: 0.15, pointerEvents: "none", userSelect: "none" }}
    >
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="115" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2f6b36" />
          <stop offset="1" stopColor="#6ee7b7" />
        </linearGradient>
      </defs>
      <path
        d="M0 50 Q24 23 65 45 Q105 66 115 9 L115 0 L0 0 Z"
        fill="url(#grad1)"
      />
      <ellipse
        cx="78"
        cy="17"
        rx="16"
        ry="11"
        fill="url(#grad1)"
      />
    </svg>
  );
}

function Disease({ name, type, symptoms, prevention, cure, medicines }) {
  const isEmpty = !cure;

  if (isEmpty) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-gray-500 font-medium text-lg">
        No detailed information available for this condition.
      </div>
    );
  }

  const InfoSection = ({ icon: Icon, title, content }) => (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 font-semibold text-lg text-green-800">
        <Icon className="text-green-600 w-5 h-5" />
        {title}
      </h3>
      <p className="text-gray-800 text-base leading-relaxed">{content}</p>
    </div>
  );

  const renderMedicines = () => {
    if (!medicines) return <p>Not specified</p>;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {medicines.split(".").map((med, i) =>
          med.trim() !== "" ? (
            <span
              key={i}
              className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium text-center"
            >
              {med.trim()}
            </span>
          ) : null
        )}
      </div>
    );
  };

  return (
    <section className="relative max-w-5xl mx-auto bg-white rounded-xl px-6 md:px-12 py-10 mt-10 mb-16 font-sans md:space-y-8 shadow">
      {/* Top right SVG decoration */}

      {/* Header */}
      <div>
        <TopRightDecoration />
        <div className="text-center md:text-left mb-5 md:mb-8 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-900 font-serif">{name}</h1>
          <p className="text-lg text-gray-600 font-medium mt-1">{type} Disease</p>
        </div>
      </div>

      {/* Two-column layout for compact display */}
      <div className="grid sm:grid-cols-2 gap-12 md:gap-16 relative z-10">
        <div className="space-y-6">
          <InfoSection icon={FaHeartbeat} title="Symptoms" content={symptoms} />
          <InfoSection icon={FaShieldAlt} title="Prevention" content={prevention} />
        </div>

        <div className="space-y-6">
          <InfoSection icon={FaStethoscope} title="Cure" content={cure} />
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-lg text-green-800">
              <FaCapsules className="text-green-600 w-5 h-5" />
              Common Medicines
            </h3>
            {renderMedicines()}
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const disease_name = searchParams.get("disease");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!disease_name) return;

    async function fetchDisease() {
      try {
        const res = await fetch("/api/add/getInfo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ disease_name }),
        });

        const result = await res.json();
        setData(result.success ? result.data[0] : null);
      } catch (err) {
        console.error("Error fetching details:", err);
        setData(null);
      }
    }

    fetchDisease();
  }, [disease_name]);

  if (!disease_name) return null;

  if(!disease_name) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-gray-500 font-serif">
        No information to display.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-gray-500 font-serif">
        Loading disease information...
      </div>
    );
  }

  return (
    <Disease
      name={data.disease_name}
      type={data.type}
      symptoms={data.symptoms}
      prevention={data.prevention}
      cure={data.cure}
      medicines={data.common_medicines}
    />
  );
}

export default function SearchPage() {
  return (
    <main className="bg-gray-50 min-h-screen pb-2">
      <Search2 />
      <Suspense fallback={<div className="text-center py-12 text-gray-500">Loading...</div>}>
        <SearchContent />
      </Suspense>
    </main>
  );
}
