"use client";

import React from "react";
import Image from "next/image";

const healingDoctorImage = "/Assets/images/image copy.png"; // Replace with real path
const globalPatientImage = "/Assets/images/image.png"; // Replace with real path

const HealingCareSection = () => {
  return (
    <section className="font-serif antialiased rounded-3xl text-gray-900 py-8 md:px-4 md:py-20">
      <div className="container mx-auto md:px-6 lg:px-8 max-w-7xl">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-0 items-center mb-16 md:mb-24">
          
          {/* Image Block */}
          <div className="order-1 md:order-2 flex justify-center w-full max-w-full px-0">
            <Image
              src={healingDoctorImage}
              alt="A compassionate Carepath doctor, wearing a mask and stethoscope, smiling towards the camera, symbolizing expert medical care and trust."
              className="md:rounded-xl object-cover md:w-[450px] w-full h-auto max-w-full"
              priority
              width={600}
              height={430}
            />
          </div>
          {/* Info Block */}
          <div className="order-2 md:order-1 px-4 sm:px-10 lg:px-16 mx-auto w-full max-w-2xl mt-8 md:mt-0">
            <h2 className="font-montserrat text-[28px] sm:text-3xl md:text-2xl lg:text-3xl font-bold text-black mb-5 sm:mb-6 leading-tight">
              Healing starts here
            </h2>
            <div className="space-y-6 text-base sm:text-sm md:text-base text-gray-700 font-lora">
              <div>
                <h3 className="text-base sm:text-xl md:text-xl font-semibold text-black mb-2">
                  The right answers the first time
                </h3>
                <p>
                  Effective treatment depends on getting the right diagnosis. Our experts diagnose and treat the toughest medical challenges.
                </p>
              </div>
              <div>
                <h3 className="text-base sm:text-xl md:text-xl font-semibold text-black mb-2">
                  Top-ranked in the India
                </h3>
                <p>
                  Carepath Clinic has more No. 1 rankings than any other hospital in the nation according to Times of India &amp; Hindustan Times.{" "}
                  <a href="#" className="text-emerald-600 font-medium hover:underline transition-colors duration-200">
                    Learn more about our top-ranked specialties
                  </a>
                </p>
              </div>
            </div>
            <button className="mt-8 px-6 py-2 border-[2px] border-green-800 text-green-900 rounded-full hover:underline hover:text-green-700 transition-all duration-300 font-medium text-base sm:text-lg md:text-lg">
              Why choose Carepath Clinic
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-0 items-center px-0 sm:px-0">
          {/* Left Image Block */}
          <div className="flex justify-center w-full max-w-full px-0">
            <Image
              src={globalPatientImage}
              alt="A loving Carepath nurse or caregiver gently holding a baby, with the mother looking on, representing empathetic care for families and global patients."
              className="md:rounded-xl object-cover w-full md:w-[450px] h-auto max-w-full"
              priority
              width={600}
              height={430}
            />
          </div>
          {/* Right Info Block */}
          <div className="px-4 sm:px-10 md:px-16 max-w-2xl mx-auto mt-8 md:mt-0 w-full font-lora">
            <h2 className="font-montserrat text-[28px] sm:text-3xl md:text-2xl lg:text-3xl font-bold text-black mb-5 sm:mb-6 leading-tight">
              World-class care for global patients
            </h2>
            <p className="text-base sm:text-sm md:text-base text-gray-700 mb-8 max-w-xl">
              We make it easy for patients from around the world to get care from Carepath Clinic.
            </p>
            <button className="px-6 py-2 border-2 border-green-800 text-green-900 rounded-full hover:text-green-700 hover:underline transition-all duration-300 font-medium text-base sm:text-lg md:text-lg">
              International services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealingCareSection;
