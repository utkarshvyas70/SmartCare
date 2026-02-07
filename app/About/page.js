import React from "react";
import Image from "next/image";

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-orange-50 min-h-screen py-14 px-6 flex items-center justify-center">
      <div className="bg-slate-50 shadow-xl rounded-lg max-w-6xl w-full p-8 lg:p-16">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-center text-green-800 mb-8 font-serif">
          About CarePath
        </h1>
        <p className="text-lg lg:text-xl text-gray-700 text-center mb-10 max-w-5xl mx-auto leading-relaxed">
          At <span className="font-bold text-green-700">CarePath</span>, we are dedicated to improving access to trustworthy healthcare information. Our mission is to empower individuals with the knowledge they need to make informed health decisions through expert-reviewed and reliable medical content.
        </p>

        {/* Section: Who We Are */}
        <section className="mb-16 px-4 sm:px-0 max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#FF6F61] text-center mb-6 font-serif">
            Who We Are
          </h2>
          <p className="text-gray-600 text-lg lg:text-xl text-center leading-relaxed max-w-4xl mx-auto">
            CarePath is a team of healthcare professionals, data scientists, and technology experts. We work together to provide a user-friendly platform where everyone can find comprehensive health resources, from disease prevention to treatment options, all in one place.
          </p>
        </section>

        {/* Section: Our Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 max-w-6xl mx-auto px-4 sm:px-0">
          {/* Value Card */}
          {[{
            imgSrc: "/Assets/images/istockphoto-1456407582-612x612.jpg",
            alt: "Integrity",
            title: "Integrity",
            description: "We are committed to delivering accurate and up-to-date medical information."
          },
          {
            imgSrc: "/Assets/images/istockphoto-852285942-612x612.jpg",
            alt: "Compassion",
            title: "Compassion",
            description: "Your health is our top priority, and we aim to provide information with care."
          },
          {
            imgSrc: "/Assets/images/istockphoto-925114818-612x612.jpg",
            alt: "Innovation",
            title: "Innovation",
            description: "We leverage the latest technology to bring healthcare information closer to you."
          }].map(({ imgSrc, alt, title, description }) => (
            <div key={title} className="text-center px-6">
              <div className="flex items-center justify-center bg-green-100 w-40 h-40 rounded-full mb-5 shadow-md mx-auto hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <Image
                  src={imgSrc}
                  alt={alt}
                  className="h-40 w-40 object-cover rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
                  width={160}
                  height={160}
                  priority
                />
              </div>
              <h3 className="text-xl font-bold text-green-700 mb-3 font-serif">{title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed max-w-xs mx-auto">{description}</p>
            </div>
          ))}
        </section>

        {/* Section: Why Choose Us */}
        <section className="mb-16 max-w-6xl mx-auto px-4 sm:px-0">
          <h2 className="text-3xl lg:text-4xl font-bold text-green-800 text-center mb-12 font-serif">
            Why Choose <span className="text-[#FF6F61]">CarePath?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Cards */}
            {[
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M12 12v1.586l-3-3V9h3V7H9a1 1 0 00-1 1v2H6v2h2v2a1 1 0 001 1h5.586l3-3V12h-3zM3 7h1v2H3V7zm0 6h1v2H3v-2z" />
                  </svg>
                ),
                title: "Reliable Information",
                desc: "Our content is expert-reviewed and backed by the latest healthcare research, ensuring you get accurate, trustworthy information.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M13 7H7a1 1 0 00-1 1v5a1 1 0 001 1h6a1 1 0 001-1V8a1 1 0 00-1-1zm-5 6V9h4v4H8zm10 4a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4.68l1.447 1.724c.193.231.477.362.773.362H12c.302 0 .585-.134.773-.361L14.22 4H19a1 1 0 011 1v12z" />
                  </svg>
                ),
                title: "Comprehensive Resources",
                desc: "From disease prevention to treatment, we offer a wide range of healthcare topics, making it easier to find the information you need.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M13 7H7a1 1 0 00-1 1v5a1 1 0 001 1h6a1 1 0 001-1V8a1 1 0 00-1-1zm-5 6V9h4v4H8zm10 4a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4.68l1.447 1.724c.193.231.477.362.773.362H12c.302 0 .585-.134.773-.361L14.22 4H19a1 1 0 011 1v12z" />
                  </svg>
                ),
                title: "User-Centered Design",
                desc: "Our platform is designed with you in mind, ensuring that you find the healthcare information you need quickly and efficiently.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="group relative p-6 bg-white rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center">
                  <div className="p-4 bg-green-100 rounded-full group-hover:bg-orange-500 transition-colors duration-300">
                    {icon}
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-green-800 text-center group-hover:text-orange-600 font-serif">
                  {title}
                </h3>
                <p className="mt-4 text-gray-600 text-center leading-relaxed group-hover:text-gray-700 max-w-[280px] mx-auto">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
