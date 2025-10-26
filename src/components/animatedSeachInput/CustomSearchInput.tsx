import React, { memo, useEffect, useRef, useState } from "react";
import "./CustomSearchInputStyles.scss";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ArrayOfStringType, inputChangeEventType } from "@/src/utilities";

// const placeholders = ["artists", "last editors", "assigners"];
interface CustomSearchInputPropTypes {
  placeholders: ArrayOfStringType;
  searchedText: string;
  handleSearch: (param: string) => void;
  loader?: boolean;
  variant?: "outlined" | "filled";
  dimensions?: React.CSSProperties;
  autoFocus?: boolean;
  disabled?: boolean;
}

function CustomSearchInput({
  placeholders = ["artists", "last editors", "assigners"],
  searchedText,
  handleSearch,
  loader = false,
  variant = "filled",
  dimensions = { height: 45, width: 300 },
  autoFocus,
  disabled = false,
}: CustomSearchInputPropTypes) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("placeholderSlideIn");

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loader && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loader, inputRef]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (placeholders?.length > 1) {
      interval = setInterval(() => {
        setAnimationClass("placeholderSlideOut");
        setTimeout(() => {
          const nextIndex = (activeIndex + 1) % placeholders.length;
          setActiveIndex(nextIndex);
          setAnimationClass("placeholderSlideIn");
        }, 300);
      }, 3000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeIndex]);
  //   console.log("re-rendering");

  return (
    <div
      style={{ ...dimensions }}
      className={`relative ${
        variant === "filled"
          ? "bg-input-grey"
          : "border-border/40 border"
      } rounded-md flex items-center justify-between px-1 cursor-text`}
    >
      <input
        disabled={disabled}
        ref={inputRef}
        type="text"
        autoFocus={autoFocus}
        value={searchedText}
        placeholder={
          placeholders?.length > 1 ? undefined : `Search ${placeholders[0]}`
        }
        onChange={(ev: inputChangeEventType) => handleSearch(ev.target.value)}
        className={`bg-[transparent] text-md-1 font-medium w-full-0.9 h-full border-none outline-none`}
      />
      {loader ? (
        <Spinner  />
      ) : searchedText ? (
        <Button
          size={"icon"}
          className="h-4 w-4"
          onClick={() => handleSearch("")}
        >
          <X/>
        </Button>
      ) : (
        <Search size={14} />
      )}
      {placeholders?.length > 1 && !searchedText && (
        <div
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
          className={`flex items-center gap-1 text-sm text-gray-400 absolute left-2`}
        >
          Search
          <div id="placeholderOptions" className={animationClass}>
            {placeholders[activeIndex]}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(CustomSearchInput);
