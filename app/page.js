import React from "react";
import Image from "next/image";
import Link from "next/link";
import Homeimage from "@/components/homeimage";
import Search1 from "@/components/search1";
import Special from "@/components/special";
import Content from "@/components/content1";
import Care from "@/components/care";
import CareJourney from "@/components/whychooseus";
import TopDoctors from "@/components/topdoctors";
import PatientSuccessStories from "@/components/success";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";


async function page() {
    return (
        <div className="bg-[#F9F9F9]">
            
            <Homeimage />
            <Search1 />
            <div className="md:h-[1px] h-[0.5px] bg-gray-200 w-10/12 mx-auto"></div>
            <TopDoctors />
            <Special />
            <Care />
            <div className="md:h-[1px] h-[0.5px] hidden md:block bg-gray-200 w-10/12 mx-auto"></div>
            <Content />
            <div className="md:h-[1px] h-[0.5px] bg-gray-200 w-10/12 mx-auto"></div>
            <CareJourney />
            
        </div>
    )
}

export default page;