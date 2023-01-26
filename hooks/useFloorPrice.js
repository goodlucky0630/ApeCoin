import { useState, useEffect, useRef } from "react";
import axios from "axios";

export const useFloorPrices = () => {
  const [data, setData] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isCallingRef = useRef(false);

  const getFloor = async () => {
    try {
      if (isCallingRef.current) return;
      isCallingRef.current = true;
      setIsError(false);
      setIsLoading(true);
      const res1 = await axios.get("/api/getFloor", {
        params: {
          poolId: "1",
        },
      });
      const res2 = await axios.get("/api/getFloor", {
        params: {
          poolId: "2",
        },
      });
      const res3 = await axios.get("/api/getFloor", {
        params: {
          poolId: "3",
        },
      });
      setData({
        1: res1.data.floor,
        2: res2.data.floor,
        3: res3.data.floor,
      });
      setIsLoading(false);
      isCallingRef.current = false;
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!data && !isCallingRef.current) {
      getFloor();
    }
  }, [data]);

  return { data, isLoading, isError, getFloor };
};
