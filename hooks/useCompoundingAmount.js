import { ethers, utils } from "ethers";
import { useProvider, useAccount } from "wagmi";
import { useMemo, useEffect, useState, useRef } from "react";
import { APECOIN, AUTO_COMPOUND } from "../constants/addresses";
import { AUTO_COMPOUND_ABI, ERC20_ABI } from "../constants/abi";

export const useCompoundingAmount = () => {
  const { address } = useAccount();
  const provider = useProvider();
  const compoundingInstance = useMemo(
    () => new ethers.Contract(AUTO_COMPOUND, AUTO_COMPOUND_ABI, provider),
    [provider]
  );
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const addressRef = useRef(address);

  const getCompoundBalance = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      addressRef.current = address;
      const balance = await compoundingInstance.maxWithdraw(address);
      setData(balance);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    if (address && compoundingInstance.provider !== null && (!data || addressRef.current !== address)) {
      getCompoundBalance();
    }
  }, [compoundingInstance, data, address]);

  return { data, isLoading, isError, getCompoundBalance };
};
