import {
  Stack,
  Flex,
  Box,
  Text,
  VStack,
  Input,
  Progress,
  Skeleton,
  HStack,
  Slider as ChakraSlider,
  Button,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Image,
} from "@chakra-ui/react";
import { useUserContext } from "../../contexts/User";
import { CardWrapper } from "../Card/CardWrapper";
import { RoundButton } from "../Buttons/RoundButton";
import { utils, Contract, constants, BigNumber } from "ethers";
import { formatAmount } from "../../utils/formatters";
import { ApeCoinLogo } from "../Icons/ApeCoinLogo";
import { BsWallet, BsWalletFill } from "react-icons/bs";
import { CiVault } from "react-icons/ci";
import { errorToast, infoToast, successToast } from "../../pages/_app";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { CHAIN } from "../../constants/chain";
import { APECOIN, BAYC, MAYC, BAKC, STAKING } from "../../constants/addresses";
import { ASSET_VAULT_ABI, ERC20_ABI, STAKING_ABI } from "../../constants/abi";
import { useState, useMemo, useEffect, useRef } from "react";
import { useGetVaultStakes } from "../../hooks/useGetVaultStakes";
import { formatEther, parseEther } from "ethers/lib/utils";
import BlueButton from "../Buttons/BlueButton";
import { useGetImage } from "../../hooks/useGetImage";
const bigDecimal = require("js-big-decimal");

const poolIds = {
  1: "BAYC",
  2: "MAYC",
  3: "BAKC",
};

const nftName = {
  [BAYC.toLowerCase()]: "BAYC",
  [MAYC.toLowerCase()]: "MAYC",
  [BAKC.toLowerCase()]: "BAKC",
};

const poolByContract = {
  [BAYC.toLowerCase()]: "1",
  [MAYC.toLowerCase()]: "2",
  [BAKC.toLowerCase()]: "3",
};

const claimFns = {
  1: "claimSelfBAYC",
  2: "claimSelfMAYC",
  3: "claimSelfBAKC",
};

const unstakeFns = {
  1: "withdrawSelfBAYC",
  2: "withdrawSelfMAYC",
  3: "withdrawBAKC",
};

const stakeFns = {
  1: "depositBAYC",
  2: "depositMAYC",
  3: "depositBAKC",
};

export const ManageStake = ({ vault, getVaults }) => {
  const stakingInterface = useMemo(() => new utils.Interface(STAKING_ABI), []);
  const userContext = useUserContext();
  const [apeAmountToVault, setApeAmountToVault] = useState("");
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const apeCoinInstance = useMemo(() => new Contract(APECOIN, ERC20_ABI, signer), [signer]);
  const vaultInstance = useMemo(() => new Contract(vault?.vault, ASSET_VAULT_ABI, signer), [vault, signer]);
  const [needsApproval, setNeedsApproval] = useState(undefined);
  const [txInProgress, setTxInProgress] = useState(false);
  const btnRef = useRef("");
  const { data: vaultStakes, isLoading, isError, getVaultStakes } = useGetVaultStakes(vault?.vault);
  const {
    data,
    isLoading: imageIsLoading,
    isLoaded,
  } = useGetImage(
    poolByContract[userContext?.stakeFromVaultState?.chosenToken?.contractAddress],
    userContext?.stakeFromVaultState?.chosenToken?.tokenId
  );

  const stake = vaultStakes?.filter(
    (i) =>
      i.poolId === userContext?.stakeFromVaultState?.chosenToken?.poolId &&
      i.tokenId === userContext?.stakeFromVaultState?.chosenToken?.tokenId
  )[0];
  const potentialPairs = vault?.inventory?.filter(
    (i) => i.contract.toLowerCase() === BAYC.toLowerCase() || i.contract.toLowerCase() === MAYC.toLowerCase()
  );

  useEffect(() => {
    userContext?.stakeFromVaultDispatch({
      type: "RESET",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (vault?.isWithdrawEnabled) {
      userContext?.stakeFromVaultDispatch({
        type: "RESET",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault]);

  useEffect(() => {
    if (vault?.inventory.length > 0 && userContext?.stakeFromVaultState?.chosenToken?.tokenId === "") {
      handleChooseTokenToStake(vault?.inventory[0]?.contract, vault?.inventory[0]?.tokenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault, userContext?.stakeFromVaultState]);

  const handleChooseTokenToStake = (contractAddress, tokenId) => {
    if (txInProgress || vault?.isWithdrawEnabled) return;
    const pId = poolByContract[contractAddress];

    userContext.stakeFromVaultDispatch({
      type: "HANDLE_CHOOSE_TOKEN",
      payload: {
        tokenId: tokenId,
        poolId: pId,
        contractAddress: contractAddress,
      },
    });
  };

  const checkIfNeedsApproval = async () => {
    try {
      const allowance = await apeCoinInstance.allowance(vault?.vault, STAKING);
      if (allowance.lt(BigNumber.from(constants.MaxUint256))) {
        setNeedsApproval(true);
      } else {
        setNeedsApproval(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const poolCap = () => {
    if (String(stake?.poolId) === "1") {
      return String(userContext.allPools[1].poolCap);
    }
    if (String(stake?.poolId) === "2") {
      return String(userContext.allPools[2].poolCap);
    }
    if (String(stake?.poolId) === "3") {
      return String(userContext.allPools[3].poolCap);
    }
    return "0";
  };

  const percentage = stake
    ? bigDecimal.multiply(bigDecimal.divide(stake?.stakedAmount, poolCap()), "100")
    : "0";

  useEffect(() => {
    if (needsApproval === undefined && apeCoinInstance.provider !== null) {
      checkIfNeedsApproval();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apeCoinInstance, needsApproval]);

  const handleSetApeAmountToVault = (e) => {
    setApeAmountToVault(e.target.value);
  };

  const transferApeCoinToVault = async () => {
    if (!signer) {
      infoToast("No Wallet Found", "Please connect wallet.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (utils.parseEther(apeAmountToVault).gt(userContext.balance)) {
      infoToast("Insufficient ApeCoin Balance", "Do not have enough ApeCoin in wallet to send.");
      return;
    }
    try {
      btnRef.current = "transfer";
      setTxInProgress(true);
      const transfer = await apeCoinInstance.transfer(vault.vault, utils.parseEther(apeAmountToVault));
      const result = await transfer.wait();
      if (result.status === 1) {
        await getVaults(true);
        await userContext.getBalance();
        setTxInProgress(false);
        successToast("Successful Transfer", "Successfully transferred ApeCoin to vault");
        setApeAmountToVault("");
      }
    } catch (error) {
      console.log(error);
      setTxInProgress(false);
      errorToast("An Error Occurred", "An error occurred sending ApeCoin to vault");
    }
  };

  const approve = async () => {
    if (!signer) {
      infoToast("No Wallet Found", "Please connect wallet.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    try {
      btnRef.current = "approve";
      setTxInProgress(true);
      const approve = await vaultInstance.callApprove(APECOIN, STAKING, constants.MaxUint256);
      const result = await approve.wait();
      if (result.status === 1) {
        await checkIfNeedsApproval();
        successToast("Approval Successfully Granted");
        setTxInProgress(false);
      }
    } catch (error) {
      setTxInProgress(false);
      errorToast("An Error Occurred", "An error occurred granting approval.");
      console.log(error);
    }
  };

  const withdrawAPE = async () => {
    if (!signer) {
      infoToast("No Wallet Found", "Please connect wallet.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    try {
      btnRef.current = "withdraw";
      setTxInProgress(true);
      const withdraw = await vaultInstance.withdrawERC20(APECOIN, address);
      const result = await withdraw.wait();
      if (result.status === 1) {
        await getVaultStakes();
        await getVaults(true);
        await userContext.getBalance();
        successToast("Successfully Withdrew $APE");
        setTxInProgress(false);
      }
    } catch (error) {
      console.log(error);
      setTxInProgress(false);
      errorToast("An Error Occurred", "An error occurred withdrawing $APE from vault.");
    }
  };

  const claim = async () => {
    if (!signer) {
      infoToast("No Wallet Found", "Please connect wallet.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (vault?.isWithdrawEnabled) {
      infoToast("Remove Assets From Vault To Unstake or Claim");
      return;
    }
    if (needsApproval) {
      infoToast("Please Approve $APE To Continue");
      return;
    }
    try {
      btnRef.current = "claim";
      setTxInProgress(true);
      const poolId = stake?.poolId;
      if (poolId.toString() === "1" || poolId.toString() === "2") {
        const bytes = stakingInterface.encodeFunctionData(claimFns[poolId], [[stake?.tokenId]]);
        const claimApe = await vaultInstance.call(STAKING, bytes);
        const result = await claimApe.wait();
        if (result.status === 1) {
          await getVaultStakes();
          await getVaults(true);
          successToast("Successfully Claimed ApeCoin Rewards");
        }
      }
      if (poolId.toString() === "3") {
        const baycPair = [stake]
          .filter((i) => i.mainTypePoolId === "1")
          .map((i) => ({
            mainTokenId: i.mainTokenId,
            bakcTokenId: i.tokenId,
          }));

        const maycPair = [stake]
          .filter((i) => i.mainTypePoolId === "2")
          .map((i) => ({
            mainTokenId: i.mainTokenId,
            bakcTokenId: i.tokenId,
          }));
        const bytes = stakingInterface.encodeFunctionData(claimFns[poolId], [baycPair, maycPair]);
        const claimApe = await vaultInstance.call(STAKING, bytes);
        const result = await claimApe.wait();
        if (result.status === 1) {
          await getVaultStakes();
          await getVaults(true);
          successToast("Successfully Claimed ApeCoin Rewards");
        }
      }
      setTxInProgress(false);
    } catch (error) {
      console.log(error);
      setTxInProgress(false);
      errorToast("An Error Occurred", "An error occurred claiming $APE from vault.");
    }
  };

  const handleUnstakeAmount = (e) => {
    const amount = e.target.value;
    const stakedBn = BigNumber.from(stake?.stakedAmount);
    const amountBn = parseEther(amount.toString() || "0");
    if (amountBn.gt(stakedBn)) {
      infoToast("Amount Too High", "Unstake amount cannot be higher than staked amount.");
      return;
    }
    userContext.stakeFromVaultDispatch({
      type: "HANDLE_UNSTAKE_AMOUNT",
      payload: amount,
    });
  };

  const unstake = async () => {
    if (!signer) {
      infoToast("No Wallet Found", "Please connect wallet.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (vault?.isWithdrawEnabled) {
      infoToast("Remove Assets From Vault To Unstake or Claim");
      return;
    }
    if (needsApproval) {
      infoToast("Please Approve $APE To Continue");
      return;
    }
    try {
      btnRef.current = "unstake";
      setTxInProgress(true);
      const poolId = stake?.poolId.toString();
      const unstakeAmount = parseEther(userContext?.stakeFromVaultState?.unstakeAmount);
      const poolCapBn = BigNumber.from(poolCap());

      if (poolId === "1" || poolId === "2") {
        const bytes = stakingInterface.encodeFunctionData(unstakeFns[poolId], [
          [{ tokenId: stake?.tokenId, amount: unstakeAmount }],
        ]);
        const unstakeApe = await vaultInstance.call(STAKING, bytes);
        const result = await unstakeApe.wait();
        if (result.status === 1) {
          await getVaultStakes();
          await getVaults(true);
          userContext.stakeFromVaultDispatch({
            type: "HANDLE_UNSTAKE_AMOUNT",
            payload: "",
          });
          successToast("Successfully Unstaked Pair!");
        }
      }
      if (poolId === "3") {
        let uncommit = false;
        if (unstakeAmount.eq(poolCapBn)) {
          uncommit = true;
        }
        const baycPair = [stake]
          .filter((i) => i.mainTypePoolId === "1")
          .map((i) => ({
            mainTokenId: i.mainTokenId,
            bakcTokenId: i.tokenId,
          }));

        if (baycPair.length === 1) {
          baycPair[0].amount = unstakeAmount;
          // baycPair[0].isUncommit = uncommit;  //uncomment this for mainnet use
        }

        const maycPair = [stake]
          .filter((i) => i.mainTypePoolId === "2")
          .map((i) => ({
            mainTokenId: i.mainTokenId,
            bakcTokenId: i.tokenId,
          }));
        if (maycPair.length === 1) {
          maycPair[0].amount = unstakeAmount;
          // maycPair[0].isUncommit = uncommit; //uncomment this for mainnet use
        }
        const bytes = stakingInterface.encodeFunctionData(unstakeFns[poolId], [baycPair, maycPair]);
        const unstakeApe = await vaultInstance.call(STAKING, bytes);
        const result = await unstakeApe.wait();
        if (result.status === 1) {
          await getVaultStakes();
          await getVaults(true);
          userContext.stakeFromVaultDispatch({
            type: "HANDLE_UNSTAKE_AMOUNT",
            payload: "",
          });
          successToast("Successfully Unstaked Pair!");
        }
      }

      setTxInProgress(false);
    } catch (error) {
      console.log(error);
      setTxInProgress(false);
      if (error.message.includes("Split pair can't partially withdraw")) {
        errorToast("Cannot Unstake Partial Amount", "Must unstake the full staked amount.");
        return;
      }
      errorToast("An Error Occurred", "An error occurred claiming $APE from vault.");
    }
  };

  const handleStakeAmount = (e) => {
    const amount = e.target.value;
    userContext.stakeFromVaultDispatch({
      type: "HANDLE_CHOOSE_AMOUNT",
      payload: amount,
    });
  };

  const stakeApe = async () => {
    if (!signer) {
      infoToast("No Wallet Found", "Please connect wallet.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (vault?.isWithdrawEnabled) {
      infoToast("Remove Assets From Vault To Unstake or Claim");
      return;
    }
    if (needsApproval) {
      infoToast("Please Approve $APE To Continue");
      return;
    }
    try {
      btnRef.current = "stake";
      setTxInProgress(true);
      const poolId = stake?.poolId.toString();
      const stakeAmount = parseEther(userContext?.stakeFromVaultState?.apeCoinAmount || "0");
      const poolCapBn = BigNumber.from(poolCap());
      const vaultBalanceBn = BigNumber.from(vault?.apeCoinBalance.toString());
      const stakedAmountBn = BigNumber.from(stake?.stakedAmount || "0");
      const maxStakeAmountBn = poolCapBn.sub(stakedAmountBn);
      const tokenId = userContext?.stakeFromVaultState?.chosenToken?.tokenId;
      if (stakeAmount.lte("0")) {
        infoToast("Enter $APE Amount To Stake");
        setTxInProgress(false);
        return;
      }
      if (stakeAmount.gt(vaultBalanceBn)) {
        infoToast(
          "Stake Amount Higher Than Vault Balance",
          `Vault balance is ${formatEther(vaultBalanceBn.toString())}`
        );
        setTxInProgress(false);
        return;
      }
      if (stakeAmount.gt(maxStakeAmountBn)) {
        infoToast("Stake Amount Too High", `Max stake amount is ${formatEther(maxStakeAmountBn.toString())}`);
        setTxInProgress(false);
        return;
      }
      if (poolId === "1" || poolId === "2") {
        const bytes = stakingInterface.encodeFunctionData(stakeFns[poolId], [
          [{ tokenId: tokenId, amount: stakeAmount }],
        ]);
        const stake = await vaultInstance.call(STAKING, bytes);
        const result = await stake.wait();
        if (result.status === 1) {
          await getVaultStakes();
          await getVaults(true);
          userContext.stakeFromVaultDispatch({
            type: "HANDLE_CHOOSE_AMOUNT",
            payload: "",
          });
          successToast("Successfully Staked Asset!");
        }
      }
      if (poolId === "3") {
        if (potentialPairs.length === 0) {
          errorToast("No Tokens To Pair With", "Cannot stake BAKC without a BAYC or MAYC");
          setTxInProgress(false);
          return;
        }
        const mainTokenId = userContext?.stakeFromVaultState?.chosenToken?.mainTokenId;
        const mainTypePoolId = userContext?.stakeFromVaultState?.chosenToken?.mainTypePoolId;
        if (!mainTokenId || !mainTypePoolId) {
          infoToast("Please Choose Token To Pair With");
          setTxInProgress(false);
          return;
        }

        const stakeArray = [{ mainTokenId: mainTokenId, bakcTokenId: tokenId, amount: stakeAmount }];

        const bytes = stakingInterface.encodeFunctionData(stakeFns[poolId], [
          mainTypePoolId === "1" ? stakeArray : [],
          mainTypePoolId === "2" ? stakeArray : [],
        ]);
        const stake = await vaultInstance.call(STAKING, bytes);
        const result = await stake.wait();
        if (result.status === 1) {
          await getVaultStakes();
          await getVaults(true);
          userContext.stakeFromVaultDispatch({
            type: "HANDLE_CHOOSE_AMOUNT",
            payload: "",
          });
          successToast("Successfully Staked Pair!");
        }
      }

      setTxInProgress(false);
    } catch (error) {
      console.log(error);
      setTxInProgress(false);
      errorToast("An Error Occurred", "An error occurred staking from vault.");
    }
  };

  useEffect(() => {
    if (
      stake?.poolId === "3" &&
      stake?.mainTypePoolId !== "0" &&
      userContext?.stakeFromVaultState?.chosenToken?.mainTypePoolId === undefined
    ) {
      userContext?.stakeFromVaultDispatch({
        type: "HANDLE_CHOOSE_TOKEN",
        payload: {
          ...userContext?.stakeFromVaultState?.chosenToken,
          mainTokenId: stake?.mainTokenId,
          mainTypePoolId: stake?.mainTypePoolId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userContext?.stakeFromVaultState, stake]);

  const handleChoosePairToken = (contractAddress, tokenId) => {
    userContext?.stakeFromVaultDispatch({
      type: "HANDLE_CHOOSE_TOKEN",
      payload: {
        ...userContext?.stakeFromVaultState?.chosenToken,
        mainTokenId: tokenId,
        mainTypePoolId: poolByContract[contractAddress],
        mainContractAddress: contractAddress,
      },
    });
  };

  const title = () => {
    if (stake?.poolId?.toString() !== "3") {
      return (
        poolIds[userContext?.stakeFromVaultState?.chosenToken?.poolId] +
        " #" +
        userContext?.stakeFromVaultState?.chosenToken?.tokenId +
        " "
      );
    }
    if (stake?.poolId?.toString() === "3" && stake?.mainTypePoolId !== "0") {
      return (
        "BAKC #" +
        userContext?.stakeFromVaultState?.chosenToken?.tokenId +
        " " +
        poolIds[stake?.mainTypePoolId] +
        " #" +
        stake?.mainTokenId
      );
    }
    if (stake?.poolId?.toString() === "3" && stake?.mainTypePoolId === "0") {
      return "BAKC #" + userContext?.stakeFromVaultState?.chosenToken?.tokenId + " ";
    }
  };

  return (
    <CardWrapper>
      <Stack gap="3">
        <Text fontWeight="bold" textAlign="center">
          ApeCoin Staking
        </Text>
        <CardWrapper>
          <Stack>
            <HStack alignItems={"flex-end"}>
              <VStack align="stretch" width="100%">
                <Text fontSize="sm" mb="3px">
                  Deposit ApeCoin
                </Text>
                <Flex
                  width="100%"
                  borderRadius="3px"
                  alignItems="center"
                  bgColor="rgba(228, 228, 228, 0.1)"
                  border="1px solid #b0005a"
                >
                  <Input
                    fontSize="lg"
                    bgColor="transparent"
                    fontWeight="bold"
                    width="100%"
                    size="sm"
                    border="0px"
                    focusBorderColor="none"
                    type="number"
                    isDisabled={txInProgress || vault?.isWithdrawEnabled}
                    value={apeAmountToVault}
                    onChange={handleSetApeAmountToVault}
                  />
                </Flex>
              </VStack>
              <RoundButton
                isDisabled={txInProgress || vault?.isWithdrawEnabled}
                isLoading={txInProgress && btnRef.current === "transfer"}
                loadingText="Depositing"
                buttonText="Deposit"
                onClick={transferApeCoinToVault}
                size="sm"
                minW="fit-content"
              />
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Flex fontSize={"xs"} gap="2" alignItems={"center"} flexWrap="wrap">
                <BsWallet /> Balance:{" "}
                <Flex gap="1">
                  {formatAmount(utils.formatEther(userContext?.balance))} <ApeCoinLogo width="15px" />
                </Flex>
              </Flex>
              <Flex fontSize={"xs"} gap="2" alignItems={"center"}>
                <CiVault /> Vault:{" "}
                <Flex gap="1">
                  {formatAmount(utils.formatEther(vault?.apeCoinBalance))} <ApeCoinLogo width="15px" />
                </Flex>
              </Flex>
            </HStack>
          </Stack>
        </CardWrapper>

        {userContext?.stakeFromVaultState?.chosenToken?.tokenId !== "" ? (
          <>
            {vault?.inventory?.length > 1 && (
              <HStack>
                {vault?.inventory?.map((i, idx) => (
                  <SmallImage
                    key={idx}
                    tokenId={i.tokenId}
                    contractAddress={i.contract}
                    handleClick={handleChooseTokenToStake}
                  />
                ))}
              </HStack>
            )}
            <Flex gap="7" flexDirection={{ md: "row", base: "column" }}>
              <Box
                borderRadius={"3px"}
                position="relative"
                bgImage={data?.imageURL}
                minW="125px"
                minH={{ md: "auto", base: "200px" }}
                maxH="200px"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                bgSize={"cover"}
                display="flex"
                alignItems={"flex-end"}
              >
                <Box display="flex" alignItems={"flex-end"} h="full" w="full">
                  <Stack w="full" spacing="1" p="2" backdropFilter="blur(2px)" bgColor="rgba(0,0,0,.4)">
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
                      value={percentage}
                    />
                    <Box fontWeight={"700"} fontSize="10px">
                      {formatAmount(percentage, 2)}% Filled
                    </Box>
                  </Stack>
                </Box>
              </Box>
              <Stack gap="0" w="100%">
                {userContext?.stakeFromVaultState?.chosenToken?.poolId === "3" &&
                  stake?.mainTypePoolId === "0" &&
                  potentialPairs.length > 0 && (
                    <Stack fontSize={"xs"} spacing="1">
                      <Box>Choose NFT to Pair With</Box>
                      <HStack>
                        {potentialPairs?.map((i, idx) => (
                          <SmallImage
                            key={idx}
                            tokenId={i.tokenId}
                            contractAddress={i.contract}
                            isDisabled={txInProgress || vault?.isWithdrawEnabled}
                            isSelected={
                              userContext?.stakeFromVaultState?.chosenToken?.mainTokenId === i.tokenId &&
                              userContext?.stakeFromVaultState?.chosenToken?.mainContractAddress ===
                                i.contract.toLowerCase()
                            }
                            handleClick={handleChoosePairToken}
                          />
                        ))}
                      </HStack>
                    </Stack>
                  )}
                <Flex gap={{ lg: "7", base: "4" }} flexDirection={{ lg: "row", base: "column" }}>
                  <VStack align="stretch" width="100%">
                    <Text fontSize="sm" mb="3px">
                      {title()} - Stake $APE
                    </Text>
                    <HStack>
                      <Flex
                        width="100%"
                        borderRadius="3px"
                        alignItems="center"
                        bgColor="rgba(228, 228, 228, 0.1)"
                        border="1px solid #b0005a"
                      >
                        <Input
                          fontSize="lg"
                          bgColor="transparent"
                          fontWeight="bold"
                          width="100%"
                          size="sm"
                          border="0px"
                          focusBorderColor="none"
                          type="number"
                          isDisabled={
                            txInProgress || BigNumber.from(stake?.stakedAmount || "0").eq(poolCap())
                          }
                          value={userContext?.stakeFromVaultState?.apeCoinAmount}
                          onChange={handleStakeAmount}
                        />
                      </Flex>
                      <RoundButton
                        isDisabled={txInProgress || vault?.isWithdrawEnabled || Number(percentage) === 100}
                        isLoading={txInProgress && btnRef.current === "stake"}
                        loadingText="Staking"
                        buttonText="Stake"
                        onClick={stakeApe}
                        size="sm"
                        minW="fit-content"
                      />
                    </HStack>
                  </VStack>
                </Flex>
                <HStack alignItems={"flex-end"}>
                  <VStack align="stretch" width="100%">
                    <Text fontSize="sm">Claimable $APE:</Text>
                    <Box
                      bgColor="rgba(228, 228, 228, 0.1)"
                      border="1px solid #b0005a"
                      borderRadius="3px"
                      fontWeight="bold"
                      width="100%"
                      py="1"
                      px="4"
                    >
                      {stake?.claimableAmount ? formatAmount(formatEther(stake?.claimableAmount), 4) : "0"}
                    </Box>
                  </VStack>
                  <RoundButton
                    isDisabled={txInProgress || stake?.claimableAmount === "0"}
                    isLoading={txInProgress && btnRef.current === "claim"}
                    loadingText="Claiming"
                    buttonText="Claim"
                    onClick={claim}
                    size="sm"
                    minW="fit-content"
                  />
                </HStack>
                <HStack alignItems={"flex-end"}>
                  <VStack align="stretch" width="100%">
                    <Text fontSize="sm">Unstake $APE:</Text>
                    <Flex
                      width="100%"
                      borderRadius="3px"
                      alignItems="center"
                      bgColor="rgba(228, 228, 228, 0.1)"
                      border="1px solid #b0005a"
                    >
                      <Input
                        fontSize="lg"
                        bgColor="transparent"
                        fontWeight="bold"
                        width="100%"
                        size="sm"
                        border="0px"
                        focusBorderColor="none"
                        type="number"
                        isDisabled={txInProgress || stake?.stakedAmount === "0"}
                        value={userContext?.stakeFromVaultState?.unstakeAmount}
                        onChange={handleUnstakeAmount}
                      />
                    </Flex>
                  </VStack>
                  <RoundButton
                    isDisabled={txInProgress || stake?.stakedAmount === "0"}
                    isLoading={txInProgress && btnRef.current === "unstake"}
                    loadingText="Unstaking"
                    buttonText="Unstake"
                    onClick={unstake}
                    size="sm"
                    minW="fit-content"
                  />
                </HStack>
                <Box fontSize={"xs"}>Staked $APE: {stake ? utils.formatEther(stake?.stakedAmount) : "-"}</Box>
              </Stack>
            </Flex>
            <Flex flexDirection={{ lg: "row", base: "column" }} justifyContent="space-between" gap="4" mt="3">
              {vault?.isWithdrawEnabled ? (
                <RoundButton
                  isDisabled={needsApproval || Number(vault?.apeCoinBalance) === 0 || txInProgress}
                  isLoading={txInProgress && btnRef.current === "withdraw"}
                  loadingText="Withdrawing"
                  buttonText="Withdraw $APE"
                  onClick={withdrawAPE}
                  w="full"
                />
              ) : (
                <RoundButton
                  isDisabled={!needsApproval || txInProgress}
                  isLoading={txInProgress && btnRef.current === "approve"}
                  buttonText={needsApproval ? "Approve $APE" : "Approved"}
                  loadingText="Approving"
                  onClick={approve}
                  w="full"
                />
              )}
            </Flex>
          </>
        ) : vault?.isWithdrawEnabled ? (
          <RoundButton
            isDisabled={needsApproval || Number(vault?.apeCoinBalance) === 0 || txInProgress}
            isLoading={txInProgress && btnRef.current === "withdraw"}
            loadingText="Withdrawing"
            buttonText="Withdraw $APE"
            onClick={withdrawAPE}
            w="full"
          />
        ) : null}
      </Stack>
    </CardWrapper>
  );
};

const SmallImage = (props) => {
  const { tokenId, contractAddress, handleClick, isSelected, ...rest } = props;
  const poolId = poolByContract[contractAddress];
  const { data, isLoading, isLoaded } = useGetImage(poolId, tokenId);
  const userContext = useUserContext();

  return (
    <Skeleton isLoaded={isLoaded && !isLoading}>
      <Image
        {...rest}
        onClick={() => handleClick(contractAddress, tokenId)}
        boxSize="60px"
        src={data?.imageURL}
        cursor="pointer"
        objectFit="cover"
        borderRadius="6px"
        alt=""
        border={
          (userContext?.stakeFromVaultState?.chosenToken?.tokenId === tokenId || isSelected) &&
          "3px solid #FF0083"
        }
      />
    </Skeleton>
  );
};
