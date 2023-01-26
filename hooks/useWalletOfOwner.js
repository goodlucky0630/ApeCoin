import axios from "axios";
import { isAddress } from "ethers/lib/utils";
import { useState, useEffect, useRef } from "react";

export const useWalletOfOwner = (address) => {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const callingRef = useRef(false);
  const addressRef = useRef(address);

  const getWalletOfOwner = async (address) => {
    try {
      callingRef.current = true;
      addressRef.current = address;
      setIsError(false);
      setIsLoading(true);
      const response = await axios.get("/api/walletOfOwner", {
        params: {
          address: address,
        },
      });
      setData(response.data.walletOfOwner);
      setIsLoading(false);
      callingRef.current = false;
    } catch (error) {
      console.log(error);
      callingRef.current = false;
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!data && isAddress(address) && !callingRef.current) {
      getWalletOfOwner(address);
    }
  }, [address, data]);

  return { data, isLoading, isError, getWalletOfOwner };
};
