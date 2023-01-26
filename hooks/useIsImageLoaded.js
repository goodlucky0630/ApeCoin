import { useState, useEffect, useRef } from "react";

export const useIsImageLoaded = (url) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const isCallingRef = useRef(false);

  const getImage = async () => {
    try {
      if (isCallingRef.current) return;
      isCallingRef.current = true;
      setIsLoaded(false);
      setIsLoading(true);
      let img = new Image();
      img.src = url;
      img.onload = () => {
        setIsLoaded(true);
      };
      img.onerror = () => {
        setIsLoaded(true);
        setIsError(true);
      };
      setIsLoading(false);
      isCallingRef.current = false;
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (url !== "" && !isLoaded && !isError && !isCallingRef.current) {
      getImage();
    }
  }, [url, isLoaded, isError]);

  return { isLoaded, isLoading, isError };
};
