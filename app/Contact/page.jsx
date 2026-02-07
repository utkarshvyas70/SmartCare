"use client"

import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="bg-stone-100 text-green-900 min-h-screen py-14 px-4 sm:px-8 lg:px-32 font-serif flex flex-col justify-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-[#1D5C48] font-serif leading-tight"
      >
        Get in Touch with <span className="text-[#257A5F]">CarePath</span>
      </motion.h1>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.7 }}
          className="bg-white shadow-xl rounded-2xl p-7 sm:p-10 border border-green-100"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#1D5C48] font-serif">Send Us a Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2.5 border rounded-full font-sans border-green-300 focus:border-[#1D5C48] focus:ring-2 focus:ring-[#257A5F] transition"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2.5 border rounded-full font-sans border-green-300 focus:border-[#1D5C48] focus:ring-2 focus:ring-[#257A5F] transition"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full px-4 py-2.5 border rounded-2xl font-sans border-green-300 focus:border-[#1D5C48] focus:ring-2 focus:ring-[#257A5F] transition resize-none"
            />
            <button
              type="submit"
              className="bg-[#1D5C48] text-white px-7 py-2.5 rounded-full text-lg font-semibold hover:bg-[#257A5F] transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.7 }}
          className="text-base sm:text-lg space-y-7 font-sans"
        >
          <div className="flex items-start space-x-4">
            <FaMapMarkerAlt className="text-[#1D5C48] w-6 h-6 mt-1" />
            <p>
              <span className="font-semibold font-serif block mb-1 text-[#257A5F]">CarePath HQ</span>
              3rd Floor, HealthTech Park,<br />
              Sector 62, Noida, Uttar Pradesh, India
            </p>
          </div>

          <div className="flex items-start space-x-4">
            <FaPhoneAlt className="text-[#1D5C48] w-6 h-6 mt-1" />
            <div>
              <p className="font-medium">+91 98765 43210</p>
              <p className="font-medium">+91 91234 56789</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <FaEnvelope className="text-[#1D5C48] w-6 h-6 mt-1" />
            <p>
              <a
                href="mailto:support@carepath.in"
                className="hover:underline text-[#1D5C48] font-semibold"
              >
                support@carepath.in
              </a>
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-sm"
          >
            <div className="bg-gradient-to-r from-[#1D5C48]/90 via-[#257A5F]/80 to-[#1D5C48]/90 rounded-2xl shadow-md flex items-center gap-4 py-2 px-4 md:px-6">
              <FaPhoneAlt className="text-white w-4 h-4" />
              <div className="flex-1">
                <h2 className="text-white text-base font-semibold mb-1 font-serif">Need immediate support?</h2>
                <p className="text-green-100 font-medium text-base">
                  Call our 24×7 helpline:{" "}
                  <span className="text-white font-bold tracking-wide text-base">
                    1800-123-4567
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          <div className="pt-2">
            <h3 className="font-semibold mb-2 text-[#1D5C48] font-serif">Follow Us</h3>
            <div className="flex space-x-5 text-[#257A5F] text-2xl">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1D5C48] transition"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1D5C48] transition"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1D5C48] transition"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
    </div>
  );
}
