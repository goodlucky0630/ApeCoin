import { ethers, utils } from "ethers";
import { useProvider, useAccount } from "wagmi";
import { useMemo, useEffect, useState, useRef } from "react";
import { APECOIN } from "../constants/addresses";
import { ERC20_ABI } from "../constants/abi";

export const useApeCoinBalance = () => {
  const { address } = useAccount();
  const provider = useProvider();
  const apeCoinInstance = useMemo(
    () => new ethers.Contract(APECOIN, ERC20_ABI, provider),
    [provider]
  );
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const addressRef = useRef(address);

  const getBalance = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      addressRef.current = address;
      const balance = await apeCoinInstance.balanceOf(address);
      setData(balance);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      address &&
      apeCoinInstance.provider !== null &&
      (!data || addressRef.current !== address)
    )
      getBalance();
  }, [apeCoinInstance, data, address]);

  return { data, isLoading, isError, getBalance };
};
