import { useEffect, useState } from "react";

export const useWindowScrollPositions = () => {
  const [scrollY, setPosition] = useState(0);

  useEffect(() => {
    function updatePosition() {
      setPosition(window.scrollY);
    }

    window.addEventListener("scroll", updatePosition);
    updatePosition();

    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  // useEffect(() => {
  //   // Calculate the height based on the scroll position
  //   const height = Math.max(3000, window.scrollY + window.innerHeight);
  // }, [scrollPosition]);

  return { scrollY };
};
