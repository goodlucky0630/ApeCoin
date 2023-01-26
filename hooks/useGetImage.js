import { useState, useEffect, useRef } from "react";
import axios from "axios";

export const useGetImage = (poolId, tokenId) => {
  const [data, setData] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const isCallingRef = useRef(false);

  const getImage = async (poolIdInput, tokenIdInput) => {
    try {
      if (isCallingRef.current) return;
      isCallingRef.current = true;
      setIsError(false);
      setIsLoaded(false);
      setIsLoading(true);
      const res = await axios.get("/api/getImage", {
        params: {
          tokenId: tokenIdInput ? tokenIdInput : tokenId,
          poolId: poolIdInput ? poolIdInput : poolId,
        },
      });
      let img = new Image();
      setData({
        imageURL: res.data.imageUrl,
        poolId: poolId,
        tokenId: tokenId,
      });
      img.src = res.data.imageUrl;
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
    if (poolId !== "" && tokenId !== "" && !data && !isCallingRef.current) {
      getImage(poolId, tokenId);
    }
  }, [poolId, data, tokenId]);

  useEffect(() => {
    if (
      poolId !== "" &&
      tokenId !== "" &&
      (data?.tokenId.toString() !== tokenId?.toString() || data?.poolId.toString() !== poolId?.toString()) &&
      !isLoading
    ) {
      getImage(poolId, tokenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, tokenId, poolId, isLoading]);

  return { data, isLoading, isLoaded, isError, getImage };
};
