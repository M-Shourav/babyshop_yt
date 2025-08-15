import React from "react";
import LeftBanner from "./banner/LeftBanner";
import RightBanner from "./banner/RightBanner";
import { Card, CardHeader, CardTitle } from "./ui/card";
import Container from "./Container";

const Banner = () => {
  return (
    <Container>
      <div className="flex items-center gap-3">
        <div className="w-1/3 hidden lg:inline-flex">
          {/* <LeftBanner /> */}
        </div>
        <div className="flex-1">
          <RightBanner />
        </div>
      </div>
    </Container>
  );
};

export default Banner;
