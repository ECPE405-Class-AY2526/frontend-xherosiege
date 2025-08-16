import React from 'react'
import { Link } from 'react-router'

const LandPageParagrah = () => {
  return (
    <div className ='flex-1 flex flex-col items-center justify-start'>
        <h1 className='text-2xl font-bold  mb-0 text-center'>Sample<br/>Title</h1>
        <p className='text-base text-center mt-3 mb-5'>sample paragraph of the website located at the bottom</p>
        <Link to ='/login'>
          <button className='bg-green-600 text-black rounded-full px-6 py-2 font-medium'>Join us now!</button>
        </Link>
    </div>
  )
}

export default LandPageParagrah