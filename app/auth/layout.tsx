import React from 'react'
// import '../globals.css'

const AuthLayout = ({children}: {children : React.ReactNode}) => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-sky-400 to-blue-900">
        {children}
    </div>
  )
}

export default AuthLayout
