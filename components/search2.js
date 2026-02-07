"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiSearch } from "react-icons/hi";

function Search2() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [allDiseases, setAllDiseases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);

  // Fetch diseases once and cache locally for filtering
  useEffect(() => {
    async function fetchDiseases() {
      try {
        const res = await fetch("/api/add/search_di", { method: "GET", cache: "force-cache" });
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setAllDiseases(result.data.map((item) => item.disease_name));
        }
      } catch (err) {
        console.error("Failed to fetch diseases:", err);
      }
    }
    fetchDiseases();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/Search?disease=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleSearch(e) {
    const val = e.target.value.trimStart();
    setQuery(val);

    const empty = val === "";
    setIsEmpty(empty);

    if (!empty) {
      const matches = allDiseases.filter((disease) =>
        disease.toLowerCase().includes(val.toLowerCase())
      );

      const prioritized = [
        ...matches.filter((disease) => disease.toLowerCase().startsWith(val.toLowerCase())),
        ...matches.filter((disease) => !disease.toLowerCase().startsWith(val.toLowerCase())),
      ];

      setFiltered(prioritized.slice(0, 5));
    } else {
      setFiltered([]);
    }
  }

  function handleClick(e) {
    const selected = e.target.name;
    setQuery(selected);
    setFiltered([]);
    router.push(`/Search?disease=${encodeURIComponent(selected)}`);
  }

  return (
    <section className="w-full bg-gradient-to-r from-[#3a7042] via-[#5a9a60] to-[#3a7042] pt-12 pb-14 px-6 sm:px-10 font-sans">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Title Section */}
        <div>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold leading-tight text-gray-900">
            Know More About Diseases
          </h2>
          <p className="text-lg sm:text-xl mt-2 text-gray-700">
            Easy-to-understand answers and quick disease lookup.
          </p>
        </div>

        {/* Search Form */}
        <div className="mt-10 w-full relative text-left">
          <form onSubmit={handleSubmit} className="relative">
            <label htmlFor="disease-search" className="sr-only">
              Search diseases
            </label>
            <div className="relative">
              <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-600" />
              <input
                id="disease-search"
                type="search"
                name="disease"
                placeholder="Search for a condition"
                value={query}
                onChange={handleSearch}
                autoComplete="off"
                aria-expanded={filtered.length > 0}
                aria-haspopup="listbox"
                className="
                    w-full
                    text-lg sm:text-xl
                    py-4 pl-14 pr-28
                    text-gray-900
                    bg-white
                    rounded-full
                    border border-gray-700
                    placeholder-gray-500
                    focus:outline-none focus:ring-4 focus:ring-green-400 focus:border-green-600
                    shadow-sm
                    transition
                "
                />

              {!isEmpty && (
                <button
                  type="submit"
                  className="
                    absolute right-2 top-1/2 -translate-y-1/2
                    px-5 py-3
                    bg-green-600 hover:bg-green-700
                    text-white
                    rounded-full
                    font-semibold
                    shadow-md
                    transition
                    duration-200
                    ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-green-600
                  "
                >
                  Search
                </button>
              )}
            </div>
          </form>

          {/* Autocomplete Suggestions */}
          {!!filtered.length && (
            <ul className="absolute z-50 mt-3 w-full max-h-60 overflow-auto rounded-b-lg bg-white border border-t-0 border-gray-300 shadow-lg text-left text-gray-900">
              {filtered.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={handleClick}
                    name={item}
                    className="
                      block
                      w-full
                      text-left
                      px-5 py-3
                      hover:bg-green-100
                      transition
                      font-medium
                      truncate
                      focus:outline-none focus:bg-green-200
                    "
                    title={item}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default Search2;
