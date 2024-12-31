"use client";
import React from "react";
import Image from "next/image";
import WeatherHeader from "@/app/components/header/WeatherHeader";
import { useRouter } from "next/navigation";

const HeaderArhonot = () => {
  const router = useRouter();

  return (
    <div
      className="sticky top-0 left-0 w-full bg-gradient-to-br from-green-200 to-blue-300
 shadow-md"
    >
      <header className="flex flex-row  justify-between">
        <div
          onClick={() => {
            router.push(`/pages/user`);
          }}
          className="cursor-pointer flex items-center"
        >
          <Image
            src="/logoNoBGblack.png"
            alt="Logo"
            width={100}
            height={80}
            className="p-1"
          />
        </div>

        <div>
          <WeatherHeader />
        </div>
      </header>
    </div>
  );
};

export default HeaderArhonot;
