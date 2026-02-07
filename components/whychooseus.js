"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  HiOutlineCalendar,
  HiOutlineUserCircle,
  HiOutlineClipboardCheck,
  HiOutlineHeart,
} from "react-icons/hi";
import Link from "next/link";

const steps = [
  {
    icon: <HiOutlineCalendar className="w-10 h-10 text-white" />,
    title: "Schedule Your Appointment",
    description:
      "Easily choose a date and time that fits your schedule; our friendly staff is ready to assist.",
  },
  {
    icon: <HiOutlineUserCircle className="w-10 h-10 text-white" />,
    title: "Meet Your Care Team",
    description:
      "Connect virtually or in-person with our board-certified doctors and specialists focused on your health.",
  },
  {
    icon: <HiOutlineClipboardCheck className="w-10 h-10 text-white" />,
    title: "Personalized Treatment Plan",
    description:
      "Receive expert diagnosis and a treatment plan tailored specifically to your unique needs.",
  },
  {
    icon: <HiOutlineHeart className="w-10 h-10 text-white" />,
    title: "Ongoing Support & Wellness",
    description:
      "We continue to support your health journey with follow-ups, wellness programs, and care coordination.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.3 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function CareJourney() {
  return (
    <section className="pt-8 pb-10 md:py-16 px-1 md:px-4 sm:px-10 max-w-7xl mx-auto font-serif text-gray-900">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16 px-4 sm:px-0">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[#1D5C48]">
          Your Care Journey
        </h2>
        <p className="text-base md:text-lg text-gray-700 max-w-xl mx-auto leading-relaxed">
          Understand what to expect every step of the way, from booking to recovery.
          We make healthcare simple, guided, and supportive.
        </p>
      </div>

      {/* Timeline Container */}
      <motion.div
        className="
          relative
          max-w-[70rem] mx-auto
          flex flex-col items-center
          space-y-12
          md:flex-row md:items-stretch md:justify-center lg:gap-14 md:gap-8 md:space-y-0
        "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {steps.map(({ icon, title, description }, i) => (
          <motion.div
            key={i}
            className="
              flex flex-col items-center
              text-center
              w-full md:w-auto md:flex-1
              px-2 space-y-3
            "
            variants={stepVariants}
          >
            <div className="flex flex-col items-center relative z-10 md:mb-4">
              <div className="bg-[#1D5C48] rounded-full p-3 shadow-lg w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-white">
                {icon}
              </div>  
              {/* Connector dot - only visible on desktop */}
              <span
                className="
                  absolute hidden md:block top-16 left-1/2 -translate-x-1/2
                  w-5 h-5 rounded-full bg-[#1D5C48] opacity-30
                "
              />
            </div>
            <div className="flex flex-col space-y-2 w-full max-w-[20rem] md:max-w-[26rem] mx-auto">
              <h3 className="font-semibold text-lg md:text-xl text-[#1D5C48]">{title}</h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">{description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Optional CTA can go here */}
    </section>
  );
}
