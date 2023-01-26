import { useEffect, createContext, useContext, useReducer, useState, useRef } from "react";
import { SiweMessage } from "siwe";

import { useAccount, useConnect, useNetwork, useSignMessage, useSwitchNetwork } from "wagmi";
import { STAKING } from "../constants/addresses";
import { CHAIN } from "../constants/chain";
import { useApeCoinAllowance } from "../hooks/useApeCoinAllowance";
import { useApeCoinApproval } from "../hooks/useApeCoinApproval";
import { useApeCoinBalance } from "../hooks/useApeCoinBalance";
import { useGetAllPools } from "../hooks/useGetAllPools";
import { useGetAllStakes } from "../hooks/useGetAllStakes";
import { stakeNFTReducer, initialFormState } from "../reducers/stakeNFTReducer";
import { nftVaultReducer, initialnftVaultState } from "../reducers/nftVaultReducer";
import { collateralReducer, initCollateralState } from "../reducers/collateralReducer";
import { useFloorPrices } from "../hooks/useFloorPrice";
import { useHistoricalFloor } from "../hooks/useHistoricalFloor";
import { initVaultStakeState, stakeFromVaultReducer } from "../reducers/stakeFromVaultReducer";
import { useCompoundingData } from "../hooks/useCompoundingData";
import { useCompoundingAmount } from "../hooks/useCompoundingAmount";
const UserContext = createContext();

export const UserWrapper = ({ children }) => {
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const addressRef = useRef(null);

  const { switchNetwork } = useSwitchNetwork();
  const { address, isConnected, connector } = useAccount({
    onDisconnect: () => {
      window.localStorage.setItem("apecoinstaking-connector-choice", null);
    },
  });
  const { connect, connectors } = useConnect();
  const { data: compoundBalance, isLoading, isError, getCompoundBalance } = useCompoundingAmount();
  const {
    data: compoundingData,
    isLoading: compoundingDataIsLoading,
    isError: compoundingDataIsError,
    getCompoundedStakes,
  } = useCompoundingData();
  const { data: allowance, getAllowance } = useApeCoinAllowance(STAKING);
  const { data: balance, getBalance } = useApeCoinBalance();
  const { isLoading: approvalIsLoading, isError: approvalIsError, approveSpender } = useApeCoinApproval();
  const { data: allStakes, isLoading: allStakesIsLoading, getAllStakes } = useGetAllStakes();
  const { data: allPools, getAllPools } = useGetAllPools();
  const [state, dispatch] = useReducer(stakeNFTReducer, initialFormState);
  const [nftVaultState, nftVaultDispatch] = useReducer(nftVaultReducer, initialnftVaultState);
  const [collateralState, collateralDispatch] = useReducer(collateralReducer, initCollateralState);
  const [stakeFromVaultState, stakeFromVaultDispatch] = useReducer(
    stakeFromVaultReducer,
    initVaultStakeState
  );
  const { data: floorData } = useFloorPrices();
  const { data: historicalFloor } = useHistoricalFloor();

  const [signInState, setSignInState] = useState({});
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (isConnected && !isSignedIn) {
      signIn();
    }
  }, [isConnected, isSignedIn]);

  useEffect(() => {
    if (address) {
      addressRef.current = address;
    }
  }, [address]);

  const signIn = async () => {
    try {
      const chainId = chain?.id;
      if (!address || !chainId) return;
      setSignInState((x) => ({ ...x, loading: true }));
      const nonceRes = await fetch("/api/nonce");
      const nonce = await nonceRes.text();
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum.",
        uri: window.location.origin,
        version: "1",
        chainId: chainId,
        nonce: nonce,
      });
      setSignInState((x) => ({ ...x, nonce }));

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Verify signature
      const verifyRes = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes.ok) throw new Error("Error verifying message");

      setIsSignedIn(true);
      setSignInState((x) => ({ ...x, loading: false }));
    } catch (error) {
      setSignInState((x) => ({ ...x, loading: false, nonce: undefined }));
      if (error.message.includes("user rejected signing")) {
        await signIn();
      }
      console.log(error.message);
    }
  };

  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/api/me");
        const json = await res.json();
        setSignInState((x) => ({ ...x, address: json.address }));
        setIsSignedIn(true);
        addressRef.current = address;
      } catch (_error) {}
    };
    // 1. page loads
    handler();

    // // 2. window is focused (in case user logs out of another window)
    // window.addEventListener("focus", handler);
    // return () => window.removeEventListener("focus", handler);
  }, []);

  useEffect(() => {
    if (address !== addressRef) {
      fetch("/api/logout");
      setSignInState({});
      setIsSignedIn(false);
      addressRef.current = null;
    }
  }, [address]);

  useEffect(() => {
    if (address && chain.id !== CHAIN) {
      switchNetwork({ chainId: CHAIN });
    }
  }, [chain, address]);

  useEffect(() => {
    const connectorId = window.localStorage.getItem("apecoinstaking-connector-choice");
    if (!address && connectorId) {
      const type = connectors.find((i) => i.id === connectorId);
      connect({ connector: type });
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      window.localStorage.setItem("apecoinstaking-connector-choice", connector.id);
    }
  }, [address, isConnected]);

  const settings = {
    allowance,
    getAllowance,
    balance,
    getBalance,
    approvalIsLoading,
    approvalIsError,
    approveSpender,
    allStakes,
    allStakesIsLoading,
    getAllStakes,
    allPools,
    getAllPools,
    state,
    dispatch,
    nftVaultState,
    nftVaultDispatch,
    collateralState,
    collateralDispatch,
    floorData,
    historicalFloor,
    stakeFromVaultState,
    stakeFromVaultDispatch,
    isSignedIn,
    compoundingData,
    compoundingDataIsLoading,
    getCompoundedStakes,
    compoundBalance,
    getCompoundBalance,
  };

  return <UserContext.Provider value={settings}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  return useContext(UserContext);
};
