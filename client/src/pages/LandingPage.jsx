import React from "react";
import LandPageNav from "../Components/LandPageNav";
import LandPageParagrah from "../Components/LandPageParagrah";
import LandPagePicture from "../Components/LandPagePicture";
import LandPageCenter from "../Components/LandPageCenter";
import LandPageBottom from "../Components/LandPageBottom";


const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <LandPageNav />
      <div className="flex m-10">
        <LandPageParagrah />
        <LandPagePicture />
      </div>
      <LandPageCenter />
      <LandPageBottom />
    </div>
  );
};

export default LandingPage;
