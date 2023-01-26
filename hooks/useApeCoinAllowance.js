import { ethers, utils } from "ethers";
import { useProvider, useAccount } from "wagmi";
import { useMemo, useEffect, useState, useRef } from "react";
import { APECOIN, STAKING } from "../constants/addresses";
import { ERC20_ABI } from "../constants/abi";

export const useApeCoinAllowance = (spender = STAKING) => {
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

  const getAllowance = async (otherSpender) => {
    try {
      setIsError(false);
      setIsLoading(true);
      addressRef.current = address;
      const allowance = await apeCoinInstance.allowance(
        address,
        otherSpender ? otherSpender : spender
      );
      setData(allowance);
      setIsLoading(false);
      return allowance;
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      address &&
      utils.isAddress(spender) &&
      apeCoinInstance.provider !== null &&
      (!data || addressRef.current !== address)
    )
      getAllowance();
  }, [apeCoinInstance, data, address, spender]);

  return { data, isLoading, isError, getAllowance };
};
