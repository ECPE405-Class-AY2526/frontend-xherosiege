import React from 'react'

const LandPageCenter = () => {
  return (
<div className="flex gap-x-20 mt-20 justify-center">
  
  <div className="card bg-base-100 w-96 shadow-sm">
    <div className="card-body">
      <h2 className="card-title">Card Title 1</h2>
      <p>
        A card component has a figure, a body part, and inside body there are
        title and actions parts
      </p>
    </div>
    <figure>
      <img
        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
        alt="Shoes"
      />
    </figure>
  </div>

  <div className="card bg-base-100 w-96 shadow-sm">
    <div className="card-body">
      <h2 className="card-title">Card Title 2</h2>
      <p>
        Another card with the same structure but placed beside the first one.
      </p>
    </div>
    <figure>
      <img
        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
        alt="Shoes"
      />
    </figure>
  </div>

  <div className="card bg-base-100 w-96 shadow-sm">
    <div className="card-body">
      <h2 className="card-title">Card Title 2</h2>
      <p>
        Another card with the same structure but placed beside the first one.
      </p>
    </div>
    <figure>
      <img
        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
        alt="Shoes"
      />
    </figure>
  </div>

</div>

  )
}

export default LandPageCenter