"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiSearch } from "react-icons/hi";

function Search1() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [allDiseases, setAllDiseases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);

  function handleClick(event) {
    const diseaseName = event.target.name;
    setQuery(diseaseName);
    setFiltered([]);
    router.push(`/Search?disease=${encodeURIComponent(diseaseName)}`);
  }

  function handleSearch(event) {
    const val = event.target.value;
    setQuery(val);
    const isEmptyValue = val.trim() === "";
    setIsEmpty(isEmptyValue);

    if (!isEmptyValue && allDiseases.length > 0) {
      const matches = allDiseases.filter((d) =>
        d.disease_name.toLowerCase().includes(val.toLowerCase())
      );

      const prioritized = [
        ...matches.filter((d) =>
          d.disease_name.toLowerCase().startsWith(val.toLowerCase())
        ),
        ...matches.filter(
          (d) => !d.disease_name.toLowerCase().startsWith(val.toLowerCase())
        ),
      ];

      setFiltered(prioritized.slice(0, 5));
    } else {
      setFiltered([]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/Search?disease=${encodeURIComponent(query)}`);
    }
  }

  useEffect(() => {
    async function fetchDiseases() {
      try {
        const res = await fetch("/api/add/search_di", {
          method: "GET",
          cache: "force-cache",
        });
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setAllDiseases(result.data);
        }
      } catch (err) {
        console.error("Error fetching diseases:", err);
      }
    }

    fetchDiseases();
  }, []);

  return (
    <section className="min-h-[50vh] lg:min-h-[60vh] flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 md:px-14 py-8 md:py-12 gap-10 md:gap-12 xl:gap-32">
      {/* Left Content: Headline + Subtext + Icon */}
      <div className="w-full max-w-md md:max-w-lg text-gray-900 space-y-6">
        <div className="flex items-center space-x-3 text-[#005542]">
          <HiSearch className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" aria-hidden="true" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat leading-tight">
            Know the Disease. <br />
            Find the Cure.
          </h1>
        </div>
        <p className="text-base sm:text-lg text-gray-700 font-lato">
          Discover reliable information on thousands of diseases and conditions empowering your healthcare decisions.
        </p>

        <div className="hidden lg:flex space-x-3 text-xs sm:text-sm text-white font-semibold flex-wrap font-lato">
          <button className="bg-[#005543dd] rounded-full px-3 sm:px-4 py-2 hover:bg-[#257a5fe9] transition" onClick={() => router.push('/Search?disease=Malaria')}>Malaria</button>
          <button className="bg-[#005543dd] rounded-full px-3 sm:px-4 py-2 hover:bg-[#257a5fe9] transition" onClick={() => router.push('/Search?disease=Hypertension (High Blood Pressure)')}>Hypertension</button>
          <button className="bg-[#005543dd] rounded-full px-3 sm:px-4 py-2 hover:bg-[#257a5fe9] transition" onClick={() => router.push('/Search?disease=Iron Deficiency Anemia')}>Anemia</button>
          <button className="bg-[#005543dd] rounded-full px-3 sm:px-4 py-2 hover:bg-[#257a5fe9] transition" onClick={() => router.push('/Search?disease=Depression (Major Depressive Disorder)')}>Depression</button>
        </div>
      </div>

      {/* Right Content: Search Box */}
      <div className="w-full max-w-lg relative">
        {/* Added Search Label above input */}
        <label
          htmlFor="disease"
          className="block font-semibold font-serif mb-3 ml-2 sm:ml-3 text-gray-900 text-lg sm:text-xl"
        >
          Search Diseases & Conditions
        </label>

        <form onSubmit={handleSubmit} className="relative text-gray-900">
          <input
            id="disease"
            name="disease"
            type="search"
            placeholder="Search diseases & conditions..."
            className={`w-full border-2 rounded-full py-3 sm:py-4 pl-12 sm:pl-14 pr-8 text-base sm:text-lg shadow-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-400 ${
              !isEmpty ? "border-green-600" : "border-gray-300"
            } transition`}
            value={query}
            onChange={handleSearch}
            autoComplete="off"
            aria-label="Search diseases and conditions"
          />
          <HiSearch
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-green-600 pointer-events-none"
            aria-hidden="true"
          />
          {!isEmpty && (
            <button
              type="submit"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow transition text-sm sm:text-base"
            >
              Search
            </button>
          )}
        </form>

        {/* Suggestion dropdown */}
        {!!filtered.length && (
          <ul className="absolute top-full mt-2 w-full md:w-11/12 bg-white rounded-lg shadow-lg max-h-60 overflow-auto z-50 border border-green-300">
            {filtered.map((item, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={handleClick}
                  name={item.disease_name}
                  className="block w-full text-left px-5 py-2.5 hover:bg-green-100 transition text-gray-700 font-medium text-base sm:text-[17px]"
                >
                  {item.disease_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Search1;
