import BlueButton from "../Buttons/BlueButton";
import { useUserContext } from "../../contexts/User";
import { useSigner, useNetwork } from "wagmi";
import { ethers, utils } from "ethers";
import { STAKING } from "../../constants/addresses";
import { STAKING_ABI } from "../../constants/abi";
import { errorToast, successToast, infoToast } from "../../pages/_app";
import { formatAmount, scientificNotationToNumber } from "../../utils/formatters";
import { nftName } from "../Staking/ApeAmountForNFT";
import { Slider } from "../Staking/Slider";
import { Box, Stack, HStack, Flex, ButtonGroup, useDisclosure } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { ApeCoinLogo } from "../Icons/ApeCoinLogo";
import { useRef, useState, useEffect, useMemo } from "react";
import { ApeCoinButtonIcon } from "../Icons/ApeCoinButtonIcon";
import { formatEther } from "ethers/lib/utils";
const bigDecimal = require("js-big-decimal");
import { ConfirmOverlay } from "./ConfirmOverlay";
import { CHAIN } from "../../constants/chain";
import { StakeWarningModal } from "../Modals/StakeWarningModal";

export const StakeInput = ({ chosenNFT, isUnstaking, handleSetShowInput, overLayRef }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const userContext = useUserContext();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const [windowWidth, setWindowWidth] = useState(undefined);
  const amountRef = useRef(userContext.nftVaultState.apeAmount);
  const [isApproving, setIsApproving] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnderstood, setIsUnderstood] = useState(false);

  const stakingInstance = useMemo(() => new ethers.Contract(STAKING, STAKING_ABI, signer), [signer]);

  const needsApproval =
    Number(formatEther(userContext.nftVaultState.apeAmount.toString())) >
    Number(ethers.utils.formatEther(userContext?.allowance?.toString()));

  const approve = async () => {
    try {
      setIsApproving(true);

      const result = await userContext.approveSpender(STAKING);
      if (result) {
        await userContext.getAllowance();
        successToast("Successful Transaction", "Successfully granted approval!");
        setIsApproving(false);
      }
    } catch (error) {
      setIsApproving(false);
      errorToast("An error occurred.", "An error occurred granting approval.");
    }
  };

  const setDimension = () => {
    setWindowWidth(window?.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", setDimension);
    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, [windowWidth]);

  const poolCap = () => {
    if (String(chosenNFT?.poolId) === "1") {
      return Number(userContext.allPools[1].poolCap);
    }
    if (String(chosenNFT?.poolId) === "2") {
      return Number(userContext.allPools[2].poolCap);
    }
    if (String(chosenNFT?.poolId) === "3") {
      return Number(userContext.allPools[3].poolCap);
    }
  };

  const maxStakeAmount = !isUnstaking
    ? Number(userContext.balance) > poolCap()
      ? bigDecimal.subtract(Number(poolCap()), Number(chosenNFT?.stakedAmount))
      : userContext.balance
    : String(chosenNFT?.stakedAmount);

  const handleAmountInputSlider = (e) => {
    userContext.nftVaultDispatch({
      type: "HANDLE_APE_AMOUNT",
      payload: scientificNotationToNumber(e.toString()),
    });
    amountRef.current = scientificNotationToNumber(e.toString());
  };

  const maxAmount = () => {
    userContext.nftVaultDispatch({
      type: "HANDLE_APE_AMOUNT",
      payload: maxStakeAmount.toString(),
    });
    amountRef.current = maxStakeAmount.toString();
  };

  const depositNFT = async () => {
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (Number(chosenNFT?.stakedAmount) === Number(poolCap())) {
      infoToast("Pool is Full", "Cannot stake anymore $APE in this pool");
      return;
    }
    if (Number(userContext.nftVaultState.apeAmount) > Number(maxStakeAmount)) {
      infoToast(
        "Amount Exceeds Pool Cap",
        `Can only stake ${ethers.utils.formatEther(maxStakeAmount.toString())} more $APE`
      );
      return;
    }
    if (Number(formatEther(userContext.nftVaultState.apeAmount.toString())) < 1) {
      infoToast("Amount Too Small", "Minimum stake amount is 1 $APE");
      return;
    }
    if (Number(chosenNFT?.stakedAmount) === 0 && !isUnderstood) {
      onOpen();
      return;
    }
    try {
      setIsLoading(true);
      let deposit;
      let result;
      if (chosenNFT.poolId === "1") {
        deposit = await stakingInstance.depositBAYC([
          {
            tokenId: chosenNFT.tokenId,
            amount: userContext.nftVaultState.apeAmount.toString(),
          },
        ]);
        result = await deposit.wait();
      }
      if (chosenNFT.poolId === "2") {
        deposit = await stakingInstance.depositMAYC([
          {
            tokenId: chosenNFT.tokenId,
            amount: userContext.nftVaultState.apeAmount.toString(),
          },
        ]);
        result = await deposit.wait();
      }

      if (result.status === 1) {
        amountRef.current = userContext.nftVaultState.apeAmount.toString();
        setIsSuccess(true);
        setIsLoading(false);
        setTxHash(result.transactionHash);
        await userContext.getBalance();
        await userContext.getAllPools();
        await userContext.getAllStakes();
        userContext.nftVaultDispatch({
          type: "HANDLE_APE_AMOUNT",
          payload: "1",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      errorToast("An Error Occurred", "An error occurred.");
    }
  };

  const depositPair = async () => {
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (Number(chosenNFT?.stakedAmount) === Number(poolCap())) {
      infoToast("Pool is Full", "Cannot stake anymore $APE in this pool");
      return;
    }
    if (Number(userContext.nftVaultState.apeAmount) > Number(maxStakeAmount)) {
      infoToast(
        "Amount Exceeds Pool Cap",
        `Can only stake ${ethers.utils.formatEther(maxStakeAmount.toString())} more $APE`
      );
      return;
    }
    if (Number(formatEther(userContext.nftVaultState.apeAmount.toString())) < 1) {
      infoToast("Amount Too Small", "Minimum stake amount is 1 $APE");
      return;
    }
    if (Number(chosenNFT?.stakedAmount) === 0 && !isUnderstood) {
      onOpen();
      return;
    }
    try {
      setIsLoading(true);
      const pairType = chosenNFT?.mainTypePoolId;
      const apePair = {
        mainTokenId: pairType === "1" ? chosenNFT.mainTokenId : "",
        bakcTokenId: pairType === "1" ? chosenNFT.tokenId : "",
        amount: pairType === "1" ? userContext.nftVaultState.apeAmount.toString() : "",
      };
      const mutantPair = {
        mainTokenId: pairType === "2" ? chosenNFT.mainTokenId : "",
        bakcTokenId: pairType === "2" ? chosenNFT.tokenId : "",
        amount: pairType === "2" ? userContext.nftVaultState.apeAmount.toString() : "",
      };
      const deposit = await stakingInstance.depositBAKC(
        pairType === "1" ? [apePair] : [],
        pairType === "2" ? [mutantPair] : []
      );
      const result = await deposit.wait();
      if (result.status === 1) {
        amountRef.current = userContext.nftVaultState.apeAmount.toString();
        setIsSuccess(true);
        setIsLoading(false);
        setTxHash(result.transactionHash);
        await userContext.getBalance();
        await userContext.getAllPools();
        await userContext.getAllStakes();
        userContext.dispatch({
          type: "HANDLE_APE_AMOUNT",
          payload: "1",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      errorToast("An Error Occurred", "An error occurred ");
    }
  };

  const withdrawNFT = async () => {
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (Number(userContext.nftVaultState.apeAmount) > Number(chosenNFT?.stakedAmount)) {
      infoToast(
        "Amount Exceeds Staked Amount",
        `Can only unstake ${ethers.utils.formatEther(chosenNFT?.stakedAmount.toString())} $APE`
      );
      return;
    }
    if (Number(formatEther(userContext.nftVaultState.apeAmount.toString())) < 1) {
      infoToast("Amount Too Small", "Minimum withdraw amount is 1 $APE");
      return;
    }
    try {
      setIsLoading(true);
      let withdraw;
      if (chosenNFT.poolId === "1") {
        withdraw = await stakingInstance.withdrawSelfBAYC([
          {
            tokenId: chosenNFT.tokenId,
            amount: userContext.nftVaultState.apeAmount.toString(),
          },
        ]);
      }
      if (chosenNFT.poolId === "2") {
        withdraw = await stakingInstance.withdrawSelfMAYC([
          {
            tokenId: chosenNFT.tokenId,
            amount: userContext.nftVaultState.apeAmount.toString(),
          },
        ]);
      }

      const result = await withdraw.wait();
      if (result.status === 1) {
        setIsSuccess(true);
        setIsLoading(false);
        setTxHash(result.transactionHash);
        await userContext.getBalance();
        await userContext.getAllPools();
        await userContext.getAllStakes();
        userContext.dispatch({
          type: "HANDLE_APE_AMOUNT",
          payload: "1",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      errorToast("An Error Occurred", "An error occurred ");
    }
  };

  const withdrawPairNFT = async () => {
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (Number(userContext.nftVaultState.apeAmount) > Number(chosenNFT?.stakedAmount)) {
      infoToast(
        "Amount Exceeds Staked Amount",
        `Can only unstake ${ethers.utils.formatEther(chosenNFT?.stakedAmount.toString())} $APE`
      );
      return;
    }
    if (Number(formatEther(userContext.nftVaultState.apeAmount.toString())) < 1) {
      infoToast("Amount Too Small", "Minimum withdraw amount is 1 $APE");
      return;
    }
    try {
      setIsLoading(true);
      const pairType = chosenNFT?.mainTypePoolId;
      const apePair = {
        mainTokenId: pairType === "1" ? chosenNFT.mainTokenId : "",
        bakcTokenId: pairType === "1" ? chosenNFT.tokenId : "",
        amount: pairType === "1" ? userContext.nftVaultState.apeAmount.toString() : "",
        isUncommit:
          pairType === "1" &&
          Number(ethers.utils.formatEther(String(chosenNFT?.stakedAmount))) ===
            Number(formatEther(userContext.nftVaultState.apeAmount.toString()))
            ? true
            : false,
      };
      const mutantPair = {
        mainTokenId: pairType === "2" ? chosenNFT.mainTokenId : "",
        bakcTokenId: pairType === "2" ? chosenNFT.tokenId : "",
        amount: pairType === "2" ? userContext.nftVaultState.apeAmount.toString() : "",
        isUncommit:
          pairType === "2" &&
          Number(ethers.utils.formatEther(String(chosenNFT?.stakedAmount))) ===
            Number(formatEther(userContext.nftVaultState.apeAmount.toString()))
            ? true
            : false,
      };
      const withdraw = await stakingInstance.withdrawBAKC(
        pairType === "1" ? [apePair] : [],
        pairType === "2" ? [mutantPair] : []
      );
      const result = await withdraw.wait();
      if (result.status === 1) {
        amountRef.current = userContext.nftVaultState.apeAmount.toString();
        setIsSuccess(true);
        setIsLoading(false);
        setTxHash(result.transactionHash);
        await userContext.getBalance();
        await userContext.getAllPools();
        await userContext.getAllStakes();
        userContext.dispatch({
          type: "HANDLE_APE_AMOUNT",
          payload: "1",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      if (error.message.includes("Split pair can't partially withdraw")) {
        errorToast("Cannot Unstake Partial Amount", "Must unstake the full staked amount.");
        return;
      }
      errorToast("An Error Occurred", "An error occurred ");
    }
  };

  const handleConfirm = async () => {
    if (!isUnstaking && (chosenNFT.poolId === "1" || chosenNFT.poolId === "2")) {
      await depositNFT();
      return;
    }
    if (isUnstaking && (chosenNFT.poolId === "1" || chosenNFT.poolId === "2")) {
      await withdrawNFT();
      return;
    }
    if (!isUnstaking && chosenNFT.poolId === "3") {
      if (chosenNFT.stakedAmount === "0") {
        infoToast("Pair BAKC in Pair Pool Widget Above To Stake");
        return;
      }
      await depositPair();
      return;
    }
    if (isUnstaking && chosenNFT.poolId === "3") {
      await withdrawPairNFT();
      return;
    }
  };

  return (
    <Stack w="full" justifyContent={"space-between"} minH="full">
      <HStack justifyContent={"space-between"}>
        <Box>{isUnstaking ? "Unstake $APE" : "Stake $APE"}</Box>
        <CloseIcon alignSelf={"end"} onClick={() => handleSetShowInput(false, false)} cursor="pointer" />
      </HStack>
      <Stack pt="6" w="full" h="full" spacing={{ base: "6", md: "8" }}>
        <Stack>
          <Box fontSize={"xs"} fontWeight="400">
            {chosenNFT?.poolId === "3"
              ? `BAKC #${chosenNFT?.tokenId}/${nftName[chosenNFT?.mainTypePoolId]} #${chosenNFT?.mainTokenId}`
              : `${nftName[chosenNFT?.poolId]} #${chosenNFT?.tokenId}`}
          </Box>
          <Box
            borderRadius={"3px"}
            border="1px solid rgba(17, 69, 233, 0.5)"
            bg="rgba(228, 228, 228, 0.1)"
            fontWeight={700}
            fontSize="xl"
            px="2"
            py="4"
            w="full"
            textOverflow={"ellipsis"}
            whiteSpace="nowrap"
            overflow={"clip"}
            boxShadow={"none"}
          >
            <Flex justifyContent="space-between">
              {ethers.utils.formatEther(userContext.nftVaultState.apeAmount.toString())}

              <ApeCoinLogo width="35px" height="35px" />
            </Flex>
          </Box>
        </Stack>
        <Stack spacing={"1"}>
          <Box fontSize={"sm"}>{"$APE Balance:"}</Box>
          <Box fontSize={"lg"} fontWeight="700">
            {formatAmount(utils.formatEther(userContext.balance.toString()), 6)}
          </Box>
        </Stack>
        <Slider
          spacing="6"
          onChange={handleAmountInputSlider}
          maxAmount={maxAmount}
          value={Number(userContext.nftVaultState.apeAmount)}
          max={Number(maxStakeAmount)}
        />
        <ButtonGroup flexDir={{ base: "column", md: "row" }} spacing="0" gap="4">
          <BlueButton
            buttonText="Approve"
            loadingText="Approving"
            isLoading={isApproving}
            isDisabled={isStaking || !needsApproval}
            onClick={approve}
            w="full"
          />
          <BlueButton
            buttonText={isUnstaking ? "Unstake" : "Stake"}
            isDisabled={isApproving || needsApproval}
            w="full"
            leftIcon={<ApeCoinButtonIcon />}
            onClick={() => setShowOverlay(true)}
          />
        </ButtonGroup>
      </Stack>
      {showOverlay && (
        <ConfirmOverlay
          width={`${overLayRef.current.offsetWidth}px`}
          height={{
            base: `${overLayRef.current.offsetHeight}px`,
            md: `${overLayRef.current.offsetHeight + 10}px`,
          }}
          boxHeight={`${overLayRef.current.offsetHeight}`}
          close={async () => {
            if (isLoading) {
              infoToast("Please Wait", "Transaction being put on chain.");
              return;
            }
            if (isSuccess) {
              setShowOverlay(false);
              userContext.nftVaultDispatch({
                type: "HANDLE_APE_AMOUNT",
                payload: "1",
              });
              setIsSuccess(false);
            } else {
              setShowOverlay(false);
            }
          }}
          stakeAmount={formatAmount(
            ethers.utils.formatEther(userContext.nftVaultState.apeAmount.toString()),
            18
          )}
          isSuccess={isSuccess}
          isUnstaking={isUnstaking}
          isLoading={isLoading}
          txHash={txHash}
          contractCall={handleConfirm}
        />
      )}
      {isOpen && (
        <StakeWarningModal
          onClose={() => {
            setIsUnderstood(true);
            onClose();
          }}
          isOpen={isOpen}
        />
      )}
    </Stack>
  );
};
