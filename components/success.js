"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaQuoteLeft, FaQuoteRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Anita Sharma",
    story:
      "CarePath helped me find the right specialist quickly. Their clear guidance and up-to-date information made my treatment seamless and gave me peace of mind.",
    role: "Breast Cancer Survivor",
  },
  {
    name: "Rajesh Kumar",
    story:
      "The information and support I found on CarePath empowered me to manage my diabetes better. The wellness programs guided me to a healthier lifestyle.",
    role: "Type 2 Diabetes Patient",
  },
  {
    name: "Dr. Meera Joshi",
    story:
      "As a practicing physician, I recommend CarePath to my patients for trustworthy medical content. It’s a reliable source that complements clinical advice.",
    role: "Pediatrician",
  },
  {
    name: "Sunita Patel",
    story:
      "The patient-first approach reflected in CarePath’s content helped me understand my condition and treatment choices clearly. Truly empathetic and professional.",
    role: "Chronic Pain Patient",
  },
];

export default function PatientSuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // Detect screen size to toggle mobile vs desktop layout
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Circular navigation helpers:
  const prev = () => {
    setCurrentIndex((idx) => (idx === 0 ? testimonials.length - 1 : idx - 1));
  };
  const next = () => {
    setCurrentIndex((idx) => (idx === testimonials.length - 1 ? 0 : idx + 1));
  };

  // Animation variants for slider
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  // Direction for framer motion animation (left or right slide)
  const [direction, setDirection] = useState(0);

  function handlePrev() {
    setDirection(-1);
    prev();
  }
  function handleNext() {
    setDirection(1);
    next();
  }

  // On non-mobile just render grid of all testimonials
  if (!isMobile) {
    return (
      <section className="bg-white py-20 px-6 sm:px-12 md:px-20 rounded-3xl max-w-7xl mx-auto font-serif text-green-900 shadow-lg">
        <h2 className="text-4xl font-extrabold text-center mb-12">Patient Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {testimonials.map(({ name, story, role }, idx) => (
            <article
              key={idx}
              tabIndex={0}
              className="bg-green-50 rounded-2xl p-8 shadow-inner flex flex-col relative cursor-default focus:outline-none focus:ring-2 focus:ring-green-600"
              aria-label={`Testimonial from ${name}, ${role}`}
            >
              <FaQuoteLeft className="text-green-600 text-4xl mb-4" aria-hidden="true" />
              <p className="text-lg italic leading-relaxed mb-6 text-green-800">&quot;{story}&quot;</p>
              <FaQuoteRight className="text-green-600 text-4xl ml-auto mb-4" aria-hidden="true" />
              <p className="font-semibold text-xl text-green-900">{name}</p>
              <p className="text-green-700">{role}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  // Mobile slider layout with animation
  const testimonial = testimonials[currentIndex];

  return (
    <section
      className="bg-white py-20 px-6 sm:px-12 md:px-20 rounded-3xl max-w-3xl mx-auto font-serif text-green-900 shadow-lg relative"
      ref={containerRef}
    >
      <h2 className="text-4xl font-extrabold text-center mb-12">Patient Success Stories</h2>

      <div className="relative overflow-hidden" style={{ height: "320px", minHeight: "320px" }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.article
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            tabIndex={0}
            className="bg-green-50 rounded-2xl p-8 shadow-inner flex flex-col relative cursor-default focus:outline-none focus:ring-2 focus:ring-green-600"
            aria-label={`Testimonial from ${testimonial.name}, ${testimonial.role}`}
          >
            <FaQuoteLeft className="text-green-600 text-4xl mb-4" aria-hidden="true" />
            <p className="text-lg italic leading-relaxed mb-6 text-green-800">&quot;{testimonial.story}&quot;</p>
            <FaQuoteRight className="text-green-600 text-4xl ml-auto mb-4" aria-hidden="true" />
            <p className="font-semibold text-xl text-green-900">{testimonial.name}</p>
            <p className="text-green-700">{testimonial.role}</p>
          </motion.article>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-center items-center mt-8 space-x-6 select-none">
        <button
          onClick={handlePrev}
          aria-label="Previous testimonial"
          className="text-green-700 hover:text-green-900 transition text-3xl p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <FaChevronLeft />
        </button>
        <div className="flex space-x-3">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Show testimonial ${idx + 1}`}
              onClick={() => {
                if (idx !== currentIndex) {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }
              }}
              className={`w-4 h-4 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 transition ${
                idx === currentIndex ? "bg-green-700" : "bg-green-300"
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          aria-label="Next testimonial"
          className="text-green-700 hover:text-green-900 transition text-3xl p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
}
