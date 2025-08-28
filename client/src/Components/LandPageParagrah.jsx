import React from 'react'
import { Link } from 'react-router'

const LandPageParagrah = () => {
  return (
    <div className ='flex-1 flex flex-col items-left justify-start'>
        <h1 className='text-2xl font-bold  mb-0 text-left'>What are vape detectors and how do they impact us?</h1>
        <p className='text-base text-left mt-3 mb-5'>
          E-cigarettes, or vapes, have rapidly grown in popularity, especially among young people, due to their sleek designs, 
          wide variety of flavors, and accessibility. While they are often marketed as a safer alternative to traditional cigarettes, 
          studies show that vaping still exposes users to harmful chemicals such as nicotine and toxic compounds that can damage the 
          lungs and heart. In the Philippines, vape use among adolescents has significantly increased, raising concerns about addiction 
          and the risk of transitioning to regular smoking. Cases of vape-related illnesses and even deaths highlight the serious health 
          dangers linked to e-cigarettes. These findings emphasize the urgent need for awareness and regulation to protect public health.
          </p>
        
        <p className='text-base text-left mt-3 mb-5'>
          Our product aims to address the growing concern of vaping in schools by providing a reliable and efficient way to detect 
          vape usage. It will detect and notify proper authorities when vaping is detected, ensuring a swift response to this issue.
          </p> 
        <Link to ='/login'>
          <button className='bg-green-600 text-black rounded-full px-6 py-2 font-medium'>Join us now!</button>
        </Link>
    </div>
  )
}

export default LandPageParagrah