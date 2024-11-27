"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const UploudButton = () => {
    const [triggerOptions, setTriggerOptions] = useState(false)
    const router = useRouter()

    return (
        <div>
            <button type="button" className="button-icon" onClick={() => { setTriggerOptions(true) }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>

            {triggerOptions &&
                // ליצור מודל
                <div className='button-select-div-wrap'>
                    <button className='button-select' onClick={() => { router.push('/pages/uploud/fromcamere') }}>צלם תמונה</button>
                    <button className='button-select' onClick={() => { router.push('/pages/uploud/fromlocal') }}>העלה תמונה מהמחשב</button>
                </div>}
        </div>
    )
}

export default UploudButton