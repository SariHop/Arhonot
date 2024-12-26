import React from 'react'
import { useRouter } from "next/navigation";

const ButtonNavigathion = ({ value, path }: { value: string; path: string }) => {
      const router = useRouter()
    
  return (
    <div className="mb-6">
        <button
          onClick={(e) => {e.preventDefault(); router.push(`/pages/user/${path}`) }}
          className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2 ml-auto"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
           <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />          </svg>
          <span>{value} </span>
        </button>
      </div>
  )
}

export default ButtonNavigathion