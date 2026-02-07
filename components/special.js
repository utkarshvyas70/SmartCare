"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import info from "@/public/Assets/data/specialdata";

function Special() {
  const [isHovered, setIsHovered] = useState([true, false, false, false]);
  const [data, setData] = useState({
    img: info[0].img,
    info: info[0].info,
  });
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/tablet on mount and on resize
  useEffect(() => {
    function updateIsMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  // Handle hover only on desktop
  function handleHover(event) {
    if (isMobile) return; // Disable hover logic on mobile/tablet

    const idx = parseInt(event.target.id, 10);
    setTimeout(() => {
      setIsHovered(() => {
        const arr = [false, false, false, false];
        arr[idx] = true;
        return arr;
      });
      const item = info[idx];
      setData(() => ({
        img: item.img,
        info: item.info,
      }));
    }, 15);
  }

  return (
    <section className="relative py-16 px-4 bg-green-50 sm:px-8 md:px-20 rounded-3xl sm:rounded-[70px] font-lato">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:space-x-36 space-y-12 lg:space-y-0">
          {/* Links Section */}
          <div className="w-full lg:w-3/5 flex flex-col my-auto mx-auto space-y-6 text-center lg:text-left">
            <h5 className="font-montserrat text-base sm:text-xl font-semibold mb-6 text-teal-700 uppercase">
              How We Can Help You
            </h5>

            <nav className="flex flex-col space-y-5">
              {info.map((item, i) => (
                <Link
                  href={item.title === "Know More about Diseases" ? "/Search" : "#"}
                  key={i}
                  id={i.toString()}
                  onMouseOver={handleHover}
                  onFocus={handleHover} 
                  className={`text-2xl sm:text-3xl lg:text-4xl font-bold cursor-pointer transition-transform duration-200 ${
                    isMobile
                      ? "text-teal-600 hover:underline hover:decoration-2 hover:decoration-teal-500" // no hover effect on mobile except underline
                      : isHovered[i]
                      ? "underline decoration-teal-600 decoration-4 scale-105 text-teal-800"
                      : "text-teal-600 hover:underline hover:decoration-2 hover:decoration-teal-500"
                  } focus:outline-none focus:ring-2 focus:ring-teal-400 rounded`}
                  onClick={(e) => {
                    if (!isMobile) e.preventDefault();
                  }}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Image and Info Section */}
          {/* On mobile/tablet don't update image/info */}
          {!isMobile && (
            <div className="w-full lg:w-2/5 flex flex-col space-y-6 items-center lg:items-start px-0 sm:px-6 lg:px-0 pr-5">
              <div className="w-72 sm:w-80 md:w-[325px] rounded-2xl overflow-hidden shadow-lg shadow-gray-800/40 transition-transform duration-500 ease-in-out">
                <Image
                  src={data.img}
                  alt="Consultation"
                  width={325}
                  height={400}
                  className="rounded-2xl object-cover transform transition-transform duration-500 ease-in-out hover:scale-[1.06]"
                  priority
                />
              </div>
              <p className="max-w-[340px] font-lato text-gray-900 font-medium text-center lg:text-left text-sm sm:text-base leading-relaxed px-3 sm:px-0">
                {data.info}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Special;
