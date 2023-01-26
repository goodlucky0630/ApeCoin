import { useState, useEffect, useRef } from "react";
import axios from "axios";

export const useHistoricalFloor = () => {
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
      const res1 = await axios.get("/api/getHistoricalFloor", {
        params: {
          poolId: "1",
        },
      });
      await new Promise((res) => setTimeout(res, 1000));
      const res2 = await axios.get("/api/getHistoricalFloor", {
        params: {
          poolId: "2",
        },
      });
      await new Promise((res) => setTimeout(res, 1000));
      const res3 = await axios.get("/api/getHistoricalFloor", {
        params: {
          poolId: "3",
        },
      });

      setData({
        baycData: res1.data,
        maycData: res2.data,
        bakcData: res3.data,
      });
      setIsLoading(false);
      isCallingRef.current = false;
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!data && !isCallingRef.current) {
      getFloor();
    }
  }, [data]);

  return { data, isLoading, isError, getFloor };
};
