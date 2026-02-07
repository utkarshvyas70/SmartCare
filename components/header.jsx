import React from "react";
import Image from "next/image";

export default function Header() {
    return (
      <header className="flex justify-between items-center p-2 border-b">
        {/* Left side - Logo */}
        <div className="logo mx-12">
        <Image src="/Assets/images/CarePath Logo.svg" alt="logo" width={200} height={200}/>
      </div>
  
        {/* Right side - Country and Language */}
        <div className="flex items-center space-x-4 mx-10">
          <div className="flex items-center space-x-1">
            <span className="text-gray-500">USA</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-gray-500">ENG</span>
          </div>
        </div>
      </header>
    );
  }
  