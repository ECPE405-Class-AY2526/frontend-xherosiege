import React from 'react'
import { Link } from 'react-router'

const LandPageParagrah = () => {
  return (
    <div className ='flex-1 flex flex-col items-left justify-start'>
        <h1 className='text-2xl font-bold  ml-5 mb-0 text-left'>What is Soil Fertility Monitoring?</h1>
        <p className='text-base text-left ml-5 mt-3 mb-5'>
    Soil plays a vital role in agriculture and food production, yet it is often overlooked despite being the foundation of every crop. 
    In the Philippines, many farmlands suffer from low to moderate soil fertility due to unsustainable farming practices, natural disasters, and the overuse of synthetic fertilizers. 
    These challenges lead to declining crop yields, increased production costs, and reduced income for farmers. 
    Our study aims to address this issue through the development of a machine-learning powered soil fertility monitoring system with automated fertigation. 
    <br />  <br />
    This innovation combines IoT technology, real-time soil analysis, and smart nutrient management to help farmers make data-driven decisions. 
    The system detects soil conditions such as pH, moisture, electrical conductivity, and NPK levels, then automatically applies the right amount of fertilizer when needed. 
    By integrating advanced technology with sustainable agriculture, our project seeks to improve crop productivity, reduce resource waste, and promote long-term soil health — empowering farmers and contributing to food security in the Philippines.
    </p>
        <Link to ='/login'>
          <button className='ml-5 bg-green-600 text-black rounded-full px-6 py-2 font-medium'>Join us now!</button>
        </Link>
    </div>
  )
}

export default LandPageParagrah