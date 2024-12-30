"use client"
import React from 'react';
import Image from 'next/image'
import ArrowLeftOutlined from '@ant-design/icons/lib/icons/ArrowLeftOutlined';
import { useRouter } from 'next/navigation';
import useUser from './store/userStore';

const ExamplePage: React.FC = () => {

  const router = useRouter()
  const { userName } = useUser();


  return (
    <div className=" from-coral-to-magenta full-screen flex justify-center w-screen h-screen items-center p-6 sm:py-10 sm:px-0">
      <div className="bg-white h-full w-full flex justify-center items-center shadow-lg">
        <div className="flex flex-col items-center justify-center pb-20 animate-fade-up">
          {/* hero */}
          <Image
            src='/logo.png'
            width={250}
            height={100}
            alt="ארעונות"
          />
          <h3 className="text-xl font-bold text-gray-900 mt-3">אופנה פוגשת תחזית</h3>
          <p className="text-sm text-gray-700 mb-7">צלמו, ערכו וקבלו המלצות</p>
          <button
            onClick={() => {
              router.push(`/pages/${userName ? "user" : "signin"}`);
            }}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-lg font-medium text-gray-900 rounded-lg group from-coral-to-magenta group-hover:from-green-400 group-hover:to-blue-600 hover:text-white active:bg-blue-600 active:text-white active:from-green-400 active:to-blue-600"
          >
            <span className="relative flex items-center px-5 py-1 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 active:bg-opacity-0">
              בואו נתחיל!
              <ArrowLeftOutlined className="pr-2" />
            </span>
          </button>

        </div>
      </div>
    </div>

  );
};

export default ExamplePage;
