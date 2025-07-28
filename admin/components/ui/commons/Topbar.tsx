import React from "react";

const Topbar = () => {
  return (
    <div className="h-14 flex items-center justify-between px-4 border-b shadow-sm bg-white">
      <div className="font-semibold text-lg">Admin Dashboard</div>
      <div className="text-sm text-gray-600">Welcome, Admin</div>
    </div>
  );
};

export default Topbar;
