import React from "react";

const LoginPage = () => {
  return (
    
  <div className="hero bg-base-200 min-h-screen">
    <div className="hero-content flex-col lg:flex-col">
    <div classname = "text-center  lg:text-center">
      <h1 class="text-3xl font-bold ">Account Login</h1>
    </div>

      <div className="hero-content flex-row lg:flex-row">
      <div className="hero-content flex-col lg:flex-col">
      <div className="card bg-base-4400 w-96 shrink-0 shadow-2xl">
      <div className="card-body">
        <fieldset className="fieldset">
          <div classname = "text-center  lg:text-center">
          <h1 class="text-2xl">Login to UserAccount</h1>
          </div>
          <div class="divider"></div>
          <label className="label mt-2">Email</label>
          <input type="email" className="input" placeholder="Email" />
          <label className="label">Password</label>
          <input type="password" className="input" placeholder="Password" />
          <div><a className="link link-hover">Forgot password?</a></div>

            <div className="hero-content flex-row lg:flex-row">
            <button className="btn btn-neutral mt-1 border-2">Login</button>
            <div class="divider lg:divider-horizontal">OR</div>
            <button className="btn bg-white border-100 border-black-500 mt-1">Sign up</button>
            </div>
        </fieldset>

      </div>
      </div>
      </div>

        <div className="hero-content flex-col lg:flex-col">
        <div classname = "text-center  lg:text-center">
        <h1 class="text-2xl">Alternate Login</h1>
        </div>
        <button className="btn bg-white border-100 border-black-500 mt-1 w-40">Log in to Facebook</button>
        <div class="divider">OR</div>
        <button className="btn bg-white border-100 border-black-500 mt-1 w-40">Log in to Gmail</button>
        </div>

      </div>
  </div>
</div>
  )
};

export default LoginPage;
