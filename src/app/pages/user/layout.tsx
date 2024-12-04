import React from 'react'

const layout = ({ children }: Readonly<{ children: React.ReactNode;}>) => {
   
    // token
    return (
        <div>
            {/* header */}
            {children}
            {/* footer */}
        </div>
    )
}

export default layout