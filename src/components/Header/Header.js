import React from "react";
import MagGlassIcon from "../../assets/MagGlassesIcon.svg";

function Header() {
  return (
    <header>
      <h5 className="text-black text-[20px] font-bold">
        Your Personal Staking Calculator
      </h5>

      <div className="my-4 relative">
        <input
          placeholder="Type a search query to filter"
          className="w-full h-[45px] bg-zinc-100 rounded pl-10"
        />
        <img
          src={MagGlassIcon}
          alt=""
          className="h-5 w-5 absolute top-3 left-3 text-gray-400"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 h-[45px] mb-3 bg-zinc-200 rounded items-center text-center">
        <h5>A</h5>
        <h5>B</h5>
        <h5>C</h5>
      </div>
    </header>
  );
}

export default Header;
