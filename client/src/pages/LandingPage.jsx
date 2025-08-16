import React from "react";
import LandPageNav from "../Components/LandPageNav";
import LandPageParagrah from "../Components/LandPageParagrah";
import LandPagePicture from "../Components/LandPagePicture";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <LandPageNav />
      <div className="flex m-10">
        <LandPageParagrah />
        <LandPagePicture />
      </div>
    </div>
  );
};

export default LandingPage;
