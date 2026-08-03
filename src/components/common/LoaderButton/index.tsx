import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Colors } from "../../../constants";

export interface LoaderButtonHandle {
  init: () => void;
  reset: (feedBackColor: string) => void;
}

interface LoaderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onPress?: () => void;
  buttonText: string;
  bgColor?: string;
  color?: string;
}

export const LoaderButton = forwardRef<LoaderButtonHandle, LoaderButtonProps>(
  (
    { onPress, buttonText, bgColor = Colors.branco, color = Colors.azulPrimario, ...props },
    ref,
  ) => {
    const [buttonScale, setButtonScale] = useState(0);
    const [buttonColor, setButtonColor] = useState(bgColor);
    const [isLoading, setIsLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      init,
      reset: (feedBackColor: string) => resetAnimation(feedBackColor),
    }));

    function initAnimation(callback: () => void = () => {}) {
      setButtonScale(1);
      setTimeout(() => callback(), 200);
    }

    function resetAnimation(feedBackColor: string) {
      setButtonColor(feedBackColor);
      setTimeout(() => {
        setIsLoading(false);
        setButtonColor(bgColor);
        setButtonScale(0);
      }, 700);
    }

    const widthStyle = buttonScale === 0 ? "w-full" : "w-[50px]";

    const init = () => {
      setIsLoading(true);
      initAnimation();
    };

    const handlePress = () => {
      setIsLoading(true);
      initAnimation(onPress);
    };

    return (
      <div
        className={`transition-all duration-200 ease-in-out ${widthStyle} h-12 rounded-full mb-4 flex items-center justify-center z-50`}
        style={{ backgroundColor: buttonColor }}
      >
        <button
          onClick={handlePress}
          disabled={isLoading}
          className="w-full h-full flex justify-center items-center rounded-full focus:outline-none"
          {...props}
        >
          <div className="flex items-center justify-center h-10">
            {isLoading ? (
              <div
                className="animate-spin border-4 border-t-transparent rounded-full w-5 h-5"
                style={{
                  borderColor: color,
                  borderTopColor: "transparent",
                }}
              />
            ) : (
              <span className="font-bold text-lg" style={{ color }}>
                {buttonText}
              </span>
            )}
          </div>
        </button>
      </div>
    );
  },
);
