import { useEffect, useState } from "react";

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768); // Updated to 768px (md breakpoint)
  };

  useEffect(() => {
    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};
