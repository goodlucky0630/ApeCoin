import { useUserContext } from "../../contexts/User";
import { Stack, Box, HStack, SimpleGrid, Progress, useDisclosure, Skeleton } from "@chakra-ui/react";
import { StakeWarningModal } from "../Modals/StakeWarningModal";
import { DoubleLeftChevron } from "../Icons/DoubleLeftChevron";
import { SortRow } from "../Buttons/SortRow";
import { formatAmount } from "../../utils/formatters";
import BlueButton from "../Buttons/BlueButton";
import { ApeAmountForNFT } from "./ApeAmountForNFT";
import { ethers, utils } from "ethers";
import { STAKING } from "../../constants/addresses";
import { STAKING_ABI } from "../../constants/abi";
import { errorToast, infoToast } from "../../pages/_app";
const bigDecimal = require("js-big-decimal");
import { useRef, useState, useEffect, useMemo } from "react";
import { NFTStakeConfirm } from "./NFTStakeConfirm";
import { chain, useNetwork, useSigner } from "wagmi";
import { useGetImage } from "../../hooks/useGetImage";
import { CHAIN } from "../../constants/chain";

const nftName = {
  1: "BAYC",
  2: "MAYC",
  3: "BAKC",
};

export const ChooseNFT = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const userContext = useUserContext();
  const [chooseMain, setChooseMain] = useState(false);
  const [chooseApeAmount, setChooseApeAmount] = useState(false);
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const amountRef = useRef(userContext.state.apeAmount);
  const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);
  const ref = useRef(null);
  const [windowWidth, setWindowWidth] = useState();
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isUnderstood, setIsUnderstood] = useState(false);

  const stakingInstance = useMemo(() => new ethers.Contract(STAKING, STAKING_ABI, signer), [signer]);

  const setDimension = () => {
    setWindowWidth(window?.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", setDimension);
    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, [windowWidth]);

  const chosenNFT = userContext.allStakes.filter(
    (i) =>
      i.poolId === userContext.state.poolId &&
      (userContext.state.poolId === "3"
        ? i.tokenId === userContext.state.dogTokenId
        : i.tokenId === userContext.state.mainTokenId)
  );

  const poolCap = () => {
    if (String(userContext.state.poolId) === "1") {
      return Number(userContext.allPools[1].poolCap);
    }
    if (String(userContext.state.poolId) === "2") {
      return Number(userContext.allPools[2].poolCap);
    }
    if (String(userContext.state.poolId) === "3") {
      return Number(userContext.allPools[3].poolCap);
    }
  };

  const nftFilter = (i) => {
    if (userContext.state.sortType === 0) {
      return i;
    }
    if (userContext.state.sortType === 1) {
      return String(i.stakedAmount) !== "0";
    }
    if (userContext.state.sortType === 2) {
      return Number(i.stakedAmount) !== poolCap();
    }
  };

  const maxStakeAmount = !isUnstaking
    ? Number(userContext.balance) > poolCap()
      ? bigDecimal.subtract(Number(poolCap()), Number(chosenNFT[0]?.stakedAmount))
      : userContext.balance
    : String(chosenNFT[0]?.stakedAmount);

  const depositPair = async () => {
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (Number(chosenNFT[0]?.stakedAmount) === Number(poolCap())) {
      infoToast("Pool is Full", "Cannot stake anymore $APE in this pool");
      return;
    }
    if (Number(userContext.state.apeAmount) > Number(maxStakeAmount)) {
      infoToast(
        "Amount Exceeds Pool Cap",
        `Can only stake ${ethers.utils.formatEther(maxStakeAmount.toString())} more $APE`
      );
      return;
    }
    if (Number(userContext.state.apeAmount) < 1) {
      infoToast("Amount Too Small", "Minimum stake amount is 1 $APE");
      return;
    }
    if (Number(chosenNFT[0]?.stakedAmount) === 0 && !isUnderstood) {
      onOpen();
      return;
    }
    try {
      setIsLoading(true);
      const pairType = userContext.state.mainTypePoolId;
      const apePair = {
        mainTokenId: pairType === "1" ? userContext.state.mainTokenId : "",
        bakcTokenId: pairType === "1" ? userContext.state.dogTokenId : "",
        amount: pairType === "1" ? utils.parseEther(userContext.state.apeAmount.toString()) : "",
      };
      const mutantPair = {
        mainTokenId: pairType === "2" ? userContext.state.mainTokenId : "",
        bakcTokenId: pairType === "2" ? userContext.state.dogTokenId : "",
        amount: pairType === "2" ? utils.parseEther(userContext.state.apeAmount.toString()) : "",
      };
      console.log(apePair);
      const deposit = await stakingInstance.depositBAKC(
        pairType === "1" ? [apePair] : [],
        pairType === "2" ? [mutantPair] : []
      );
      const result = await deposit.wait();
      if (result.status === 1) {
        amountRef.current = userContext.state.apeAmount;
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
    if (Number(userContext.state.apeAmount) > Number(chosenNFT[0]?.stakedAmount)) {
      infoToast(
        "Amount Exceeds Staked Amount",
        `Can only unstake ${ethers.utils.formatEther(userContext.state.apeAmount.toString())} $APE`
      );
      return;
    }
    if (Number(userContext.state.apeAmount) < 1) {
      infoToast("Amount Too Small", "Minimum withdraw amount is 1 $APE");
      return;
    }
    try {
      setIsLoading(true);
      const pairType = userContext.state.mainTypePoolId;
      const apePair = {
        mainTokenId: pairType === "1" ? userContext.state.mainTokenId : "",
        bakcTokenId: pairType === "1" ? userContext.state.dogTokenId : "",
        amount: pairType === "1" ? utils.parseEther(userContext.state.apeAmount.toString()) : "",
        isUncommit:
          pairType === "1" &&
          Number(ethers.utils.formatEther(String(chosenNFT[0]?.stakedAmount))) ===
            Number(userContext.state.apeAmount)
            ? true
            : false,
      };
      const mutantPair = {
        mainTokenId: pairType === "2" ? userContext.state.mainTokenId : "",
        bakcTokenId: pairType === "2" ? userContext.state.dogTokenId : "",
        amount: pairType === "2" ? utils.parseEther(userContext.state.apeAmount.toString()) : "",
        isUncommit:
          pairType === "2" &&
          Number(ethers.utils.formatEther(String(chosenNFT[0]?.stakedAmount))) ===
            Number(userContext.state.apeAmount)
            ? true
            : false,
      };
      const withdraw = await stakingInstance.withdrawBAKC(
        pairType === "1" ? [apePair] : [],
        pairType === "2" ? [mutantPair] : []
      );
      const result = await withdraw.wait();
      if (result.status === 1) {
        amountRef.current = userContext.state.apeAmount;
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

  const depositNFT = async () => {
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (Number(chosenNFT[0]?.stakedAmount) === Number(poolCap())) {
      infoToast("Pool is Full", "Cannot stake anymore $APE in this pool");
      return;
    }
    if (Number(userContext.state.apeAmount) > Number(maxStakeAmount)) {
      infoToast(
        "Amount Exceeds Pool Cap",
        `Can only stake ${ethers.utils.formatEther(maxStakeAmount.toString())} more $APE`
      );
      return;
    }
    if (Number(userContext.state.apeAmount) < 1) {
      infoToast("Amount Too Small", "Minimum stake amount is 1 $APE");
      return;
    }
    if (Number(chosenNFT[0]?.stakedAmount) === 0 && !isUnderstood) {
      onOpen();
      return;
    }
    try {
      setIsLoading(true);
      let deposit;
      if (userContext.state.poolId === "1") {
        deposit = await stakingInstance.depositBAYC([
          {
            tokenId: userContext.state.mainTokenId,
            amount: utils.parseEther(userContext.state.apeAmount.toString()),
          },
        ]);
      }
      if (userContext.state.poolId === "2") {
        deposit = await stakingInstance.depositMAYC([
          {
            tokenId: userContext.state.mainTokenId,
            amount: utils.parseEther(userContext.state.apeAmount.toString()),
          },
        ]);
      }

      const result = await deposit.wait();
      if (result.status === 1) {
        amountRef.current = userContext.state.apeAmount;
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
    if (Number(userContext.state.apeAmount) > Number(chosenNFT[0]?.stakedAmount)) {
      infoToast(
        "Amount Exceeds Staked Amount",
        `Can only unstake ${ethers.utils.formatEther(chosenNFT[0]?.stakedAmount.toString())} $APE`
      );
      return;
    }
    if (Number(userContext.state.apeAmount) < 1) {
      infoToast("Amount Too Small", "Minimum withdraw amount is 1 $APE");
      return;
    }
    try {
      setIsLoading(true);
      let withdraw;
      if (userContext.state.poolId === "1") {
        withdraw = await stakingInstance.withdrawSelfBAYC([
          {
            tokenId: userContext.state.mainTokenId,
            amount: utils.parseEther(userContext.state.apeAmount.toString()),
          },
        ]);
      }
      if (userContext.state.poolId === "2") {
        withdraw = await stakingInstance.withdrawSelfMAYC([
          {
            tokenId: userContext.state.mainTokenId,
            amount: utils.parseEther(userContext.state.apeAmount.toString()),
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

  const handleChoice = (tokenId, poolId) => {
    if (
      String(userContext.state.poolId) === "3" &&
      userContext.state.dogTokenId !== "" &&
      (poolId === "2" || poolId === "1")
    ) {
      if (
        userContext.allStakes.filter(
          (i) => i.poolId === "3" && i.mainTokenId === tokenId && i.mainTypePoolId === poolId
        ).length !== 0
      ) {
        infoToast("Already Paired");
        return;
      }
      userContext.dispatch({
        type: "HANDLE_MAIN_TOKEN_ID",
        payload: tokenId,
      });
      userContext.dispatch({
        type: "HANDLE_MAIN_POOL_ID",
        payload: poolId,
      });
      return;
    }

    if (
      (String(userContext.state.poolId) === "1" || String(userContext.state.poolId) === "2") &&
      (poolId === "1" || poolId === "2")
    ) {
      userContext.dispatch({
        type: "HANDLE_MAIN_TOKEN_ID",
        payload: tokenId,
      });
      return;
    }
    if (String(userContext.state.poolId) === "3" && poolId === "3") {
      userContext.dispatch({
        type: "HANDLE_DOG",
        payload: tokenId,
      });
      const pairedWith = userContext.allStakes.filter(
        (i) => i.poolId === "3" && i.tokenId === tokenId && i.mainTokenId !== "0"
      );
      if (pairedWith.length !== 0) {
        userContext.dispatch({
          type: "HANDLE_MAIN_TOKEN_ID",
          payload: pairedWith[0].mainTokenId,
        });
        userContext.dispatch({
          type: "HANDLE_MAIN_POOL_ID",
          payload: pairedWith[0].mainTypePoolId,
        });
        if (userContext.state.sortType === 1) {
          setIsUnstaking(true);
        }
        setChooseApeAmount(true);
      }
      return;
    }
  };

  const next = async () => {
    if (isSuccess) {
      userContext.dispatch({
        type: "RESET",
      });
      return;
    }
    if (
      userContext.state.poolId === "3" &&
      userContext.state.dogTokenId !== "" &&
      userContext.state.mainTokenId === "" &&
      chooseMain
    ) {
      infoToast("Select NFT to Continue.");
      return;
    }
    if (
      (userContext.state.poolId === "1" || userContext.state.poolId === "2") &&
      userContext.state.mainTokenId === ""
    ) {
      infoToast("Select NFT to Continue.");
      return;
    }
    if (
      userContext.state.poolId === "3" &&
      userContext.state.dogTokenId !== "" &&
      userContext.state.mainTokenId === ""
    ) {
      setChooseMain(true);
      return;
    }

    if (
      userContext.state.poolId === "3" &&
      userContext.state.dogTokenId !== "" &&
      userContext.state.mainTokenId !== "" &&
      Number(userContext.state.apeAmount) >
        Number(ethers.utils.formatEther(userContext?.allowance?.toString()))
    ) {
      await userContext.approveSpender(STAKING);
      await userContext.getAllowance();
      return;
    }
    if (
      userContext.state.poolId === "3" &&
      userContext.state.dogTokenId !== "" &&
      userContext.state.mainTokenId !== "" &&
      Number(userContext.state.apeAmount) !== "" &&
      chooseApeAmount &&
      Number(userContext.state.apeAmount) <=
        Number(ethers.utils.formatEther(userContext?.allowance?.toString()))
    ) {
      if (!userContext.state.hasConfirmed && isUnstaking) {
        setShowConfirmOverlay(true);
        userContext.dispatch({
          type: "HANDLE_CONFIRM",
          payload: true,
        });
        return;
      }
      if (isUnstaking && userContext.state.hasConfirmed) {
        await withdrawPairNFT();
        return;
      }
      if (!userContext.state.hasConfirmed && Number(chosenNFT[0]?.stakedAmount) === Number(poolCap())) {
        infoToast("This pool is at max capacity");
        return;
      }
      if (!userContext.state.hasConfirmed) {
        setShowConfirmOverlay(true);
        userContext.dispatch({
          type: "HANDLE_CONFIRM",
          payload: true,
        });
        return;
      }
      await depositPair();
      return;
    }
    if (
      (userContext.state.poolId === "1" || userContext.state.poolId === "2") &&
      userContext.state.mainTokenId !== "" &&
      Number(userContext.state.apeAmount) !== "" &&
      chooseApeAmount &&
      Number(userContext.state.apeAmount) <=
        Number(ethers.utils.formatEther(userContext?.allowance?.toString()))
    ) {
      if (!userContext.state.hasConfirmed && isUnstaking) {
        setShowConfirmOverlay(true);
        userContext.dispatch({
          type: "HANDLE_CONFIRM",
          payload: true,
        });
        return;
      }
      if (isUnstaking && userContext.state.hasConfirmed) {
        await withdrawNFT();
        return;
      }
      if (!userContext.state.hasConfirmed && Number(chosenNFT[0]?.stakedAmount) === Number(poolCap())) {
        infoToast("This pool is at max capacity");
        return;
      }
      if (!userContext.state.hasConfirmed) {
        setShowConfirmOverlay(true);
        userContext.dispatch({
          type: "HANDLE_CONFIRM",
          payload: true,
        });
        return;
      }
      await depositNFT();
      return;
    }
    if (
      userContext.state.poolId === "3" &&
      userContext.state.dogTokenId !== "" &&
      userContext.state.mainTokenId !== ""
    ) {
      setChooseApeAmount(true);
      if (userContext.state.sortType === 1) {
        setIsUnstaking(true);
      }
      return;
    }
    if (userContext.state.poolId !== "3" && userContext.state.mainTokenId !== "") {
      if (userContext.state.sortType === 1) {
        setIsUnstaking(true);
      }
      setChooseApeAmount(true);
      return;
    }
    if (userContext.state.poolId === "3" && userContext.state.dogTokenId === "") {
      infoToast("Select NFT to Continue.");
      return;
    }
  };

  const btnText = () => {
    if (isSuccess) {
      return "Close";
    }
    if (isUnstaking && showConfirmOverlay) {
      return "Confirm";
    }
    if (userContext.state.sortType === 1) {
      return "Manage";
    }
    if (
      userContext.state.poolId === "3" &&
      (userContext.state.dogTokenId === "" || userContext.state.mainTokenId === "")
    ) {
      return "Next";
    }
    if (
      userContext.state.mainTokenId !== "" &&
      chooseApeAmount &&
      Number(userContext.state.apeAmount) >
        Number(ethers.utils.formatEther(userContext?.allowance?.toString()))
    ) {
      return "Approve";
    }
    if (
      userContext.state.mainTokenId !== "" &&
      !chooseApeAmount &&
      Number(userContext.state.apeAmount) <=
        Number(ethers.utils.formatEther(userContext?.allowance?.toString()))
    ) {
      return "Next";
    }
    if (
      userContext.state.mainTokenId !== "" &&
      chooseApeAmount &&
      Number(userContext.state.apeAmount) <=
        Number(ethers.utils.formatEther(userContext?.allowance?.toString()))
    ) {
      return "Confirm";
    }
    if (
      userContext.state.poolId === "3" &&
      userContext.state.dogTokenId !== "" &&
      userContext.state.mainTokenId !== ""
    ) {
      return "Next";
    }
    if (userContext.state.poolId !== "3" && userContext.state.mainTokenId !== "") {
      return "Next";
    }
    return "Next";
  };

  return (
    <Stack minW="fit-content" maxW="sm" animation={"fadeIn .75s"} fontFamily={"Space Mono, monospace"}>
      <HStack>
        <DoubleLeftChevron cursor="pointer" onClick={() => userContext.dispatch({ type: "RESET" })} />
        <Box fontWeight={"700"}>
          {chooseApeAmount
            ? `${isUnstaking ? "Unload" : "Load"} your ${
                userContext?.state?.poolId === "3" ? "Pair" : "Ape"
              } with $APE`
            : chooseMain && userContext?.state?.poolId === "3"
            ? "Select BAYC or MAYC to Pair"
            : `Select ${nftName[userContext.state.poolId]} NFT to Stake`}
        </Box>
      </HStack>
      <Stack
        ref={ref}
        align={"center"}
        position="relative"
        h="xs"
        maxW="sm"
        spacing="0"
        border="1px solid rgba(230, 230, 230, 0.1)"
        borderRadius={"12px"}
      >
        {!chooseApeAmount ? (
          <>
            <SortRow mt="3" />
            <SimpleGrid
              py="4"
              columns={{ base: 1, md: 2 }}
              gap="4"
              px="5"
              overflowY={"scroll"}
              sx={{
                "&::-webkit-scrollbar": {
                  width: "2px",
                  borderRadius: "2px",
                  backgroundColor: `rgba(0, 0, 0, 0.05)`,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: `white`,
                  borderRadius: "8px",
                },
              }}
            >
              {userContext?.allStakes
                ?.filter((i) =>
                  !chooseMain
                    ? i.poolId === String(userContext.state.poolId)
                    : i.poolId === "1" || i.poolId === "2"
                )
                .filter((i) => nftFilter(i)).length > 0 ? (
                userContext?.allStakes
                  .filter((i) =>
                    !chooseMain
                      ? i.poolId === String(userContext.state.poolId)
                      : i.poolId === "1" || i.poolId === "2"
                  )
                  .filter((i) => nftFilter(i))
                  .map((i, idx) => (
                    <NFTCard
                      key={idx}
                      tokenId={i.tokenId}
                      poolId={i.poolId}
                      stakedAmount={i.stakedAmount}
                      onClick={() => handleChoice(i.tokenId, i.poolId)}
                    />
                  ))
              ) : (
                <Box>No assets found.</Box>
              )}
            </SimpleGrid>
          </>
        ) : (
          <ApeAmountForNFT
            chosenNFT={chosenNFT[0]}
            maxStakeAmount={ethers.utils.formatEther(maxStakeAmount.toString())}
            poolCap={poolCap()}
            amountRef={amountRef}
            isUnstaking={isUnstaking}
          />
        )}
        {showConfirmOverlay && (
          <NFTStakeConfirm
            width={`${ref.current.offsetWidth}px`}
            height={`${ref.current.offsetHeight}px`}
            boxHeight={`${ref.current.offsetHeight}`}
            close={() => {
              if (isSuccess) {
                userContext.dispatch({
                  type: "RESET",
                });
              } else {
                setShowConfirmOverlay(false);
                userContext.dispatch({
                  type: "HANDLE_CONFIRM",
                  payload: false,
                });
              }
            }}
            stakeAmount={formatAmount(amountRef.current, 18)}
            isSuccess={isSuccess}
            isUnstaking={isUnstaking}
            isLoading={isLoading}
            txHash={txHash}
          />
        )}
      </Stack>
      <HStack justifyContent={"space-between"}>
        <Box fontWeight={700}>
          Stake in <br /> {nftName[userContext.state.poolId]} Pool
        </Box>
        <BlueButton
          onClick={next}
          isLoading={userContext.approvalIsLoading || isLoading}
          loadingText={isLoading ? (isUnstaking ? "Unstaking" : "Staking") : "Approving"}
          buttonText={btnText()}
        />
      </HStack>
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

const NFTCard = (props) => {
  const userContext = useUserContext();
  const { tokenId, stakedAmount, poolId, onClick, ...rest } = props;
  const { data, isLoading, isLoaded, isError, getImage } = useGetImage(poolId, tokenId);

  useEffect(() => {
    if (
      data?.tokenId.toString() !== tokenId.toString() ||
      (data?.poolId.toString() !== poolId.toString() && !isLoading)
    ) {
      getImage(poolId, tokenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, tokenId, poolId, isLoading]);

  const poolCap = () => {
    if (String(poolId) === "1") {
      return String(userContext.allPools[1].poolCap);
    }
    if (String(poolId) === "2") {
      return String(userContext.allPools[2].poolCap);
    }
    if (String(poolId) === "3") {
      return String(userContext.allPools[3].poolCap);
    }
  };

  const percentage = bigDecimal.multiply(bigDecimal.divide(stakedAmount, poolCap()), "100");

  const isSelected = () => {
    if (
      String(userContext.state.poolId) === "3" &&
      userContext.state.dogTokenId !== "" &&
      poolId !== "3" &&
      userContext.state.mainTokenId === tokenId
    ) {
      return true;
    }

    if (
      String(userContext.state.poolId) === poolId &&
      (poolId === "1" || poolId === "2") &&
      userContext.state.mainTokenId === tokenId
    ) {
      return true;
    }
    if (
      String(userContext.state.poolId) === poolId &&
      poolId === "3" &&
      userContext.state.dogTokenId === tokenId
    ) {
      return true;
    }
  };

  return (
    <Skeleton isLoaded={isLoaded && !isLoading}>
      <Box
        {...rest}
        animation={"fadeIn .75s"}
        cursor={"pointer"}
        border={isSelected() ? "5px solid #FF0083" : "1px solid rgba(230, 230, 230, 0.3)"}
        boxShadow={isSelected() && "0px 8px 24px rgba(255, 0, 131, 0.64)"}
        borderRadius={"3px"}
        position="relative"
        bgImage={data?.imageURL}
        width="150px"
        height={"200px"}
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        bgSize={"cover"}
        onClick={onClick}
        display="flex"
        Items={"flex-end"}
      >
        <Box
          display="flex"
          alignItems={"flex-end"}
          h="full"
          w="full"
          backdropFilter={isSelected() && "blur(2px)"}
        >
          <Stack
            w="full"
            spacing="1"
            p="2"
            backdropFilter="blur(2px)"
            bgColor={!isSelected() && "rgba(0,0,0,.4)"}
          >
            {isSelected() && (
              <Box
                mx="auto"
                mb="8"
                bg="#FF0083"
                borderRadius={"1.5px"}
                px="3"
                py="2"
                fontWeight={"700"}
                border="1px solid rgba(230, 230, 230, 0.5)"
              >
                Selected
              </Box>
            )}
            <Progress
              border="1px solid #FBFCFD"
              bg="#FBFCFD"
              sx={{
                "& > div": {
                  background: "#FF0083",
                },
              }}
              size="sm"
              borderRadius={"full"}
              value={Math.ceil(Number(percentage))}
            />
            <Box fontWeight={"700"} fontSize="14px">
              {formatAmount(percentage, 3) + "%"} Filled
            </Box>
          </Stack>
        </Box>
      </Box>
    </Skeleton>
  );
};
