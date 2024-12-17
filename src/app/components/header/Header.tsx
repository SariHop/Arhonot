"use client"
import React from 'react'
import Image from "next/image";
import WeatherHeader from '@/app/components/header/WeatherHeader'
import { useRouter } from 'next/navigation';

const HeaderArhonot = () => {

    const router = useRouter()

    return (
        <div className="sticky top-0 left-0 w-full bg-gray-100 shadow-md">
            <header className='flex flex-row  justify-between'>
                <div  onClick={()=>{router.push(`/pages/user`)}} className="cursor-pointer flex items-center">
                <Image
                    src="/logoNoBGblack.png"
                    alt="Logo"
                    width={150}
                    height={120}
                    className='p-3'
                />
                </div>

                <div>
                    <WeatherHeader />
                </div>
            </header>
        </div>
    )
}

export default HeaderArhonot