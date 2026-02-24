import React from 'react'
// import '../globals.css'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden">
      {/* Ambient light background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-400/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>
      <div className="relative z-10 w-full flex items-center justify-center p-4 sm:p-6">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
