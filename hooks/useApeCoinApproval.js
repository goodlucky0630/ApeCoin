import { constants, ethers, utils } from "ethers";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { useMemo, useState, useRef } from "react";
import { APECOIN } from "../constants/addresses";
import { ERC20_ABI } from "../constants/abi";
import { CHAIN } from "../constants/chain";
import { infoToast } from "../pages/_app";

export const useApeCoinApproval = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const apeCoinInstance = useMemo(() => new ethers.Contract(APECOIN, ERC20_ABI, signer), [signer]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const addressRef = useRef(address);

  const approveSpender = async (spender) => {
    if (!signer) {
      infoToast("No Wallet Found", "Please connect a wallet.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    try {
      if (!utils.isAddress(spender)) return;
      setIsError(false);
      setIsLoading(true);
      addressRef.current = address;
      const approveTx = await apeCoinInstance.approve(spender, constants.MaxUint256);
      const result = await approveTx.wait();
      if (result.status === 1) {
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.log(error);
      return false;
    }
  };
  return { isLoading, isError, approveSpender };
};
