import React from 'react'

const LandPageBox = () => {
  return (
    <header className='bg-base-100 border-b border-base-content/10'>
        <div className ="mx-auto max-w-10xl px-4 py-5 flex justify-between items-center mb-0">
            <div className="flex space-x-6">
                <button className="text-black font-medium">Home</button>
                <button className="text-black font-medium">Dashboard</button>
                <button className='text-black font-medium'>About us</button>
            </div>

            <div className='flex items-center space-x-4'>
                <span className='text-2xl'>🔍</span>
                <div className='w-10 h-10 rounded-full bg-black flex items-center justify-center'>
                </div>
            </div>
        </div>
    </header>
  )
}

export default LandPageBox