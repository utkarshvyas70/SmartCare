'use client';

import React, { useState } from "react";
import Link from "next/link";
import { GoChevronRight } from "react-icons/go";

function Homeimage() {
  const [isHovered, setHover] = useState(false);

  return (
    <div className="relative w-full h-[63vh] md:h-[83vh] overflow-hidden font-serif">
      {/* Background Video — slightly lighter */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover brightness-[.65] z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/Assets/videos/large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional soft gradient overlay */}
      <div className="absolute inset-0 bg-black/10 z-0 " />

      {/* Hero Content Overlay */}
      <div className="relative z-10 flex flex-col justify-between h-full px-6 md:px-12 pt-[60px] pb-12 text-white">
        {/* Headline & CTA */}
        <div className="mt-auto space-y-4 max-w-3xl">
          <h1 className="text-[28px] md:text-5xl lg:text-[44px] leading-tight font-bold text-[#F9FAFB] drop-shadow">
            Empowering Health Through
            <br className="hidden md:block" />
            <span className="text-[#C1E1C1]"> Technology</span>
          </h1>

          <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="flex items-center space-x-1 group"
          >
            <Link
              href="/About"
              className="text-lg md:text-xl font-medium font-lora text-white hover:text-[#C2F0D3] group-hover:underline transition"
            >
              Learn how we drive innovation
            </Link>
            <span
              className={`transition-transform duration-300 ${
                isHovered ? "translate-x-1" : "-translate-x-1"
              }`}
            >
              <GoChevronRight
                className="text-lg md:text-xl mt-1.5 text-white hover:text-[#C2F0D3]"
              />
            </span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-6">
          <Link
            href="/Consult"
            className="inline-block border-2 border-green-50 text-green-50 text-lg md:text-xl font-semibold py-2 px-6 rounded-full hover:bg-[#257A5F] transition duration-200 shadow"
          >
            Request Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Homeimage;
