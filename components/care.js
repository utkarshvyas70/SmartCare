"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GoChevronRight } from "react-icons/go";

const diseases = ["Asthma", "Tubercolosis", "Influenza", "Malaria", "Dengue", "Cholera", "Polio", "Stroke", "Anemia", "Scurvy"];
var i = 0;

function Care() {
    const [di, setDisease] = useState(diseases[0]);
    const [isHovered, setHover] = useState(false);
    const [isChange, setChange] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            i = (i + 1) % diseases.length;
            setChange(true);
            setTimeout(() => {
                setDisease(diseases[i]);
                setChange(false);
            }, 1000)
        }, 2000);
        return () => clearInterval(intervalId);
    }, []);

    function handleHover() {
        setHover(true);
    }
    function notHandleHover() {
        setHover(false);
    }

    return (
        <div className="text-center font-sans mt-12 mb-8 md:mb-12 sm:my-16 font-medium px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-green-900 font-medium">Get Care Today For</h1>
            <div className="text-3xl sm:text-5xl md:text-5xl lg:text-[50px] text-teal-700 -mt-2 sm:-mt-4 pt-5">
                <h1 className={isChange ? "animate-change1" : "animate-change2"}>{di}</h1>
            </div>
            <div className="flex flex-row place-content-center mt-4">
                <Link href="#" className="text-sm sm:text-base md:text-lg font-lato text-green-800 font-semibold" onMouseOver={handleHover} onMouseLeave={notHandleHover}>
                    Consult doctors for treatment
                </Link>
                <span className={`${isHovered ? "translate-x-1" : "-translate-x-1"} transition-all duration-500`}>
                    <GoChevronRight className="text-green-800 text-sm md:text-base mt-1 md:mt-2 ml-1" />
                </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-green-900 font-medium w-full sm:w-4/5 lg:w-3/5 mx-auto leading-snug sm:leading-[60px] lg:leading-[75px] mt-10">
                Book a consultation with our doctors.
            </h1>
        </div>
    )
}

export default Care;
