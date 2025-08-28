import React from 'react'

const LandPageCenter = () => {
  return (
<div className="flex gap-x-20 mt-20 justify-center">
  
  <div className="card bg-base-100 w-96 shadow-sm">
    <div className="card-body">
      <h2 className="card-title">History of vapes and vape detectors</h2>
      <p class>
        Learn more on the invention of vape detectors and how they have evolved over time.
      </p>
    </div>
    <figure>
      <img
        src="src/Assets/timeline-of-vape.webp"
        alt="Shoes"
            className="w-full h-60 object-cover rounded-md"
      />
    </figure>
  </div>

  <div className="card bg-base-100 w-96 shadow-sm">
    <div className="card-body">
      <h2 className="card-title">Trends in vape and vape detection</h2>
      <p>
        Look into the latest news and trends about vape detectors.
      </p>
    </div>
    <figure>
      <img
        src="src/Assets/infograph-teens-vaping.jpg"
        alt="Shoes"
            className="w-full h-60 object-cover rounded-md"
      />
    </figure>
  </div>

  <div className="card bg-base-100 w-96 shadow-sm">
    <div className="card-body">
      <h2 className="card-title">How our vape detector is made</h2>
      <p>
        Discover the technology and processes behind our innovative vape detection system.
      </p>
    </div>
    <figure>
      <img
        src="src/Assets/VapeDetectorIMG2.jpg"
        alt="Shoes"
            className="w-full h-60 object-cover rounded-md"
      />
    </figure>
  </div>

</div>

  )
}

export default LandPageCenter