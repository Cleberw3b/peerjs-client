import { useState, useEffect } from "react";
import { throttle } from "../public/js/util";

const useHeightToTop = (updateInterval = 200) => {
  const isClient = typeof window === "object";

  function getHeightToTop() {
    return isClient ? window.pageYOffset : undefined;
  }

  const [heightToTop, setHeightToTop] = useState(getHeightToTop);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    const handleScroll = throttle(() => {
      setHeightToTop(getHeightToTop());
    }, updateInterval);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heightToTop]);

  return heightToTop;
};

export default useHeightToTop;
