import React from "react";
import LandPageNav from "../Components/LandPageNav";
import LandPageParagrah from "../Components/LandPageParagrah";
import LandPagePicture from "../Components/LandPagePicture";
import LandPageCenter from "../Components/LandPageCenter";


const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <LandPageNav />
      <div className="flex m-10">
        <LandPageParagrah />
        <LandPagePicture />
      </div>
      <LandPageCenter />
    </div>
  );
};

export default LandingPage;
