import React from "react";

const Loading = () => {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center ">
      <div className="flex flex-col items-center justify-center gap-y-1 ">
        <span className="loader" />
        <p className="text-base font-medium text-muted-foreground ">
          Please wait a second...
        </p>
      </div>
    </div>
  );
};

export default Loading;
