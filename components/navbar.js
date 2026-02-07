'use client';


import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { usePathname } from 'next/navigation';
import { handleLogout } from '@/app/actions/auth';
import CarePathLogo from '@/public/Assets/images/CarePathLogo';
import Image from 'next/image';


function UserAvatar({ name, photoURL }) {
  if (photoURL) {
    return (
      <Image
        src={photoURL}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border-2 border-[#1E4D3E] shadow-sm"
        width={32}
        height={32}
      />
    );
  }
  const letter = (name?.[0] || '?').toUpperCase();
  return (
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white text-xl font-extrabold border-2 border-gray-700 shadow-sm">
      {letter}
    </div>
  );
}


function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  const dropdownTimeoutRef = useRef();


  const showDropdown = (setter) => {
    clearTimeout(dropdownTimeoutRef.current);
    setter(true);
  };


  const delayedHideDropdown = (setter) => {
    dropdownTimeoutRef.current = setTimeout(() => setter(false), 120);
  };


  const pathname = usePathname();


  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Contact Us', href: '/Contact' },
    { label: 'About', href: '/About' },
  ];


  const services = [
    { label: 'Know about Diseases', href: '/Search' },
    { label: 'Diagnostics', href: '/services/diagnostics' },
    { label: 'Consultation', href: '/Consult' },
    { label: 'Therapy & Wellness', href: '/services/therapy' },
    { label: 'Telemedicine', href: '/services/telemedicine' },
  ];


  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };


    window.addEventListener('scroll', handleScroll);


    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }


    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuOpen]); // Removed `scrolled` from dependencies to prevent re-renders


  return (
    <nav
      className={`
        sticky top-0 z-50 font-lato transition-all duration-300
        ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-md' : 'bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-transform hover:scale-[1.02] active:scale-100">
            <CarePathLogo className="h-10 w-auto" white={false} />
          </Link>


          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-7 md:text-[10px] lg:text-[17.5px] text-gray-700 font-semibold items-center tracking-wide">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    relative 
                    after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#1E4D3E] after:transition-all after:duration-300
                    hover:text-[#1E4D3E] 
                    ${pathname === href ? 'text-[#1E4D3E] font-bold after:w-full' : 'after:w-0'}
                  `}
                >
                  {label}
                </Link>
              </li>
            ))}


            {/* Services Desktop Dropdown */}
            <li
              className="relative cursor-pointer group"
              onMouseEnter={() => showDropdown(setServicesDropdown)}
              onMouseLeave={() => delayedHideDropdown(setServicesDropdown)}
            >
              <button
                className="flex items-center gap-1.5 text-gray-700 font-semibold transition hover:text-[#1E4D3E]"
                aria-haspopup="true"
                tabIndex={0}
              >
                Our Services <HiChevronDown className="text-xl transition-transform duration-200 group-hover:rotate-180" />
              </button>
              {servicesDropdown && (
                <ul
                  className="absolute mt-2 -left-6 bg-white/90 backdrop-blur-lg text-gray-800 shadow-xl rounded-md w-56 z-40 font-normal text-base ring-1 ring-black ring-opacity-5 animate-fade-in-down"
                  onMouseEnter={() => showDropdown(setServicesDropdown)}
                  onMouseLeave={() => delayedHideDropdown(setServicesDropdown)}
                >
                  {services.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>


          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-6 text-[17px] font-semibold">
            {user ? (
              <div
                className="relative"
                onMouseEnter={() => showDropdown(setProfileDropdown)}
                onMouseLeave={() => delayedHideDropdown(setProfileDropdown)}
                tabIndex={-1}
                aria-label="User Menu"
              >
                <button
                  type="button"
                  className="flex items-center gap-3 focus:outline-none text-gray-800 rounded-full px-2 py-1 transition-all hover:bg-gray-50"
                  onClick={() => setProfileDropdown((d) => !d)}
                  aria-haspopup="menu"
                  aria-expanded={profileDropdown}
                  tabIndex={0}
                >
                  <UserAvatar name={user.role === 'doctor' ? user.doctor_name : user.patient_name} photoURL={user.profile_photo_url} />
                  <div className="flex items-center gap-1">
                    <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{user.role === 'doctor' ? user.doctor_name : user.patient_name}</span>
                    <HiChevronDown className="ml-1 text-2xl text-gray-500 transition-transform duration-200" />
                  </div>
                </button>


                {profileDropdown && (
                  <ul
                    className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-lg border border-gray-200 shadow-xl rounded-lg text-gray-800 text-base z-50 font-normal p-0 ring-1 ring-black ring-opacity-5 animate-fade-in-down"
                    tabIndex={-1}
                    role="menu"
                    onMouseEnter={() => showDropdown(setProfileDropdown)}
                    onMouseLeave={() => delayedHideDropdown(setProfileDropdown)}
                  >
                    {/* USER INFO SECTION */}
                    <li className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-[17px] truncate">{user.role === 'doctor' ? user.doctor_name : user.patient_name}</div>
                        <span className='mb-1 rounded-3xl text-xs text-green-700 font-medium px-2 py-0.5 border-[1.5px] border-green-500 whitespace-nowrap'>
                          {user.role === 'doctor' ? 'Doctor' : 'Patient'}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm truncate">{user.email}</div>
                    </li>


                    {/* MENU LINKS SECTION */}
                    <li>
                      <Link href="/profile" className="block px-4 py-2 hover:bg-gray-200 transition" role="menuitem">
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/Appointments" className="block px-4 py-2 hover:bg-gray-200 transition" role="menuitem">
                        Appointments
                      </Link>
                    </li>
                    <li>
                      <Link href="/Messages" className="block px-4 py-2 hover:bg-gray-200 transition" role="menuitem">
                        Messages
                      </Link>
                    </li>


                    {/* SIGN OUT SECTION */}
                    <li className="border-t border-gray-100">
                      <form action={handleLogout}>
                        <button
                          type="submit"
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 transition"
                          role="menuitem"
                        >
                          Sign Out
                        </button>
                      </form>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/Login"
                  className="text-gray-700 hover:text-[#1E4D3E] transition font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/Signup"
                  className="px-6 py-2.5 bg-[#1D5C48] text-white rounded-full hover:bg-[#1E4D3E] transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>


          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-[#1E4D3E] text-2xl focus:outline-none"
            aria-label="Open sidebar menu"
          >
            <HiMenu />
          </button>
        </div>


        {/* MOBILE SLIDE-IN SIDEBAR */}
        <div
          className={`
            fixed inset-0 z-[150] transition
            ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}
          `}
        >
          {/* Overlay */}
          <div
            onClick={() => setMenuOpen(false)}
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
              menuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />


          {/* Sidebar */}
          <div
            className={`
              fixed top-0 left-0 h-full w-[85vw] max-w-xs bg-white shadow-2xl transform
              transition-transform duration-300 ease-in-out
              ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
              md:hidden flex flex-col font-serif font-semibold text-gray-800
            `}
            tabIndex={-1}
            aria-label="Mobile menu"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <CarePathLogo className="h-9 w-auto" white={false} />
              <button
                className="text-[#1D5C48] text-2xl"
                aria-label="Close sidebar menu"
                onClick={() => setMenuOpen(false)}
              >
                <HiX />
              </button>
            </div>


            <ul className="py-4 flex flex-col gap-1 text-base">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block px-6 py-2 hover:bg-gray-100 rounded transition ${
                      pathname === href ? 'text-[#1D5C48] font-bold' : ''
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}


              {/* Services section */}
              <details className="w-full px-6 py-2 group">
                <summary className="font-semibold text-gray-700 cursor-pointer hover:underline select-none">
                  Our Services
                </summary>
                <div className="ml-3 mt-1 flex flex-col">
                  {services.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="block text-gray-700 px-3 py-1 rounded hover:bg-gray-100 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </details>
            </ul>


            {user ? (
              <div className="border-t px-6 py-3 mt-auto">
                <div className="flex items-center gap-2 mb-2 text-[#1D5C48] text-base">
                  <UserAvatar name={user.role === 'doctor' ? user.doctor_name : user.patient_name} photoURL={user.profile_photo_url} />
                  <div className="flex flex-col">
                    <div className="font-bold text-[17px] truncate">{user.role === 'doctor' ? user.doctor_name : user.patient_name}</div>
                    <div className="text-gray-500 text-sm truncate">{user.email}</div>
                  </div>
                </div>
                <Link href="/Profile" className="block py-1 hover:text-[#257A5F]" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>
                <Link href="/Appointments" className="block py-1 hover:text-[#257A5F]" onClick={() => setMenuOpen(false)}>
                  Appointments
                </Link>
                <Link href="/Messages" className="block py-1 hover:text-[#257A5F]" onClick={() => setMenuOpen(false)}>
                  Messages
                </Link>
                <form action={handleLogout}>
                  <button
                    type="submit"
                    className="w-full text-left mt-3 text-red-600 hover:underline text-base"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="border-t flex flex-col gap-2 px-6 py-3 mt-auto">
                <Link
                  href="/Login"
                  className="text-[#1D5C48] hover:text-[#257A5F] text-base"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/Signup"
                  className="block bg-[#1D5C48] text-white py-2 rounded-full text-center hover:bg-[#257A5F]"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


export default Navbar;