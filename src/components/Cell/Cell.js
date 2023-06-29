import { useRef } from "react";
import PenIcon from "../../assets/pen.svg";

function Cell({ value, onChange, onBlur, onFocus, className }) {
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className={`${className} p-2 border-[1px] w-full bg-neutral-50 h-[45px] text-center font-normal border-zinc-100 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 focus:ring-opacity-50 shadow-sm`}
        value={value}
        onChange={handleChange}
        ref={inputRef}
        onBlur={(e) => onBlur(e.target.value)}
        onFocus={onFocus}
      />

      <img
        src={PenIcon}
        alt=""
        className="absolute z-20 top-4 right-3 w-[17px] cursor-pointer md:block hidden"
        onClick={handleClick}
      />
    </div>
  );
}

export default Cell;
