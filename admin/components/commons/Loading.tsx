import { FadeLoader, PuffLoader } from "react-spinners";
import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center z-10">
      <div className="flex flex-col items-center justify-center gap-y-1">
        <span className="loader" />
        <p className="text-base font-medium text-muted-foreground ">
          Please wait a second...
        </p>
      </div>
    </div>
  );
};

export default Loading;
