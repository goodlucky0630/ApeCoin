import {
  Stack,
  Flex,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  Button,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { useState, useEffect, useMemo } from "react";
import { useNetwork, useSigner } from "wagmi";
import { useUserContext } from "../../contexts/User";
import { errorToast, infoToast, successToast } from "../../pages/_app";
import { formatAmount } from "../../utils/formatters";
import { CHAIN } from "../../constants/chain";
import { STAKING } from "../../constants/addresses";
import { STAKING_ABI } from "../../constants/abi";

const claimFns = {
  0: "claimSelfApeCoin",
  1: "claimSelfBAYC",
  2: "claimSelfMAYC",
  3: "claimSelfBAKC",
};

export const Claim = ({ isOpen, onClose }) => {
  const [value, setValue] = useState("0");
  const userContext = useUserContext();
  const [claimableAmounts, setClaimableAmount] = useState({});
  const [isClaiming, setIsClaiming] = useState(false);
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const instance = useMemo(() => new ethers.Contract(STAKING, STAKING_ABI, signer), [signer]);

  const getClaimAmounts = () => {
    let apeTotal = userContext?.allStakes?.filter((i) => i.poolId === "0")?.map((i) => i.claimableAmount);

    const baycClaimableArray = userContext?.allStakes
      ?.filter((i) => i.poolId === "1")
      ?.map((i) => i.claimableAmount);

    let baycTotal = "0";
    if (baycClaimableArray.length > 0) {
      for (let i = 0; i < baycClaimableArray.length; i++) {
        baycTotal = BigNumber.from(baycTotal).add(baycClaimableArray[i]);
      }
    }

    const maycClaimableArray = userContext?.allStakes
      ?.filter((i) => i.poolId === "2")
      ?.map((i) => i.claimableAmount);

    let maycTotal = "0";
    if (maycClaimableArray.length > 0) {
      for (let i = 0; i < maycClaimableArray.length; i++) {
        maycTotal = BigNumber.from(maycTotal).add(maycClaimableArray[i]);
      }
    }

    const bakcClaimableArray = userContext?.allStakes
      ?.filter((i) => i.poolId === "3")
      ?.map((i) => i.claimableAmount);

    let bakcTotal = "0";
    if (bakcClaimableArray.length > 0) {
      for (let i = 0; i < bakcClaimableArray.length; i++) {
        bakcTotal = BigNumber.from(bakcTotal).add(bakcClaimableArray[i]);
      }
    }

    setClaimableAmount({
      0: apeTotal.toString(),
      1: baycTotal.toString(),
      2: maycTotal.toString(),
      3: bakcTotal.toString(),
    });
  };

  useEffect(() => {
    if (userContext?.allStakes && Object.keys(claimableAmounts).length === 0) {
      getClaimAmounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userContext, claimableAmounts]);

  const claim = async () => {
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (!signer) {
      infoToast("No Wallet Found", "Please connect wallet to claim.");
      return;
    }
    if (claimableAmounts[value] === "0") {
      infoToast("Nothing To Claim", "Currently do not have $APE to claim in this pool.");
      return;
    }
    try {
      setIsClaiming(true);
      let result;
      if (value === "0") {
        const claimApe = await instance[claimFns[value]]();
        result = await claimApe.wait();
      }

      if (value === "1") {
        const baycClaimableArray = userContext?.allStakes
          ?.filter((i) => i.poolId === "1" && i.claimableAmount !== "0")
          .map((i) => i.tokenId);
        const claimApe = await instance[claimFns[value]](baycClaimableArray);
        result = await claimApe.wait(1);
      }

      if (value === "2") {
        const maycClaimableArray = userContext?.allStakes
          ?.filter((i) => i.poolId === "2" && i.claimableAmount !== "0")
          .map((i) => i.tokenId);
        const claimApe = await instance[claimFns[value]](maycClaimableArray);
        result = await claimApe.wait();
      }

      if (value === "3") {
        const bakcClaimableArray = userContext?.allStakes?.filter(
          (i) => i.poolId === "3" && i.claimableAmount !== "0"
        );
        const baycPairs = bakcClaimableArray
          .filter((i) => i.mainTypePoolId === "1")
          .map((i) => ({
            mainTokenId: i.mainTokenId,
            bakcTokenId: i.tokenId,
          }));

        const maycPairs = bakcClaimableArray
          .filter((i) => i.mainTypePoolId === "2")
          .map((i) => ({
            mainTokenId: i.mainTokenId,
            bakcTokenId: i.tokenId,
          }));

        const claimApe = await instance[claimFns[value]](baycPairs, maycPairs);
        result = await claimApe.wait();
      }

      if (result.status === 1) {
        setIsClaiming(false);
        const claimAmount = formatAmount(ethers.utils.formatEther(claimableAmounts?.[value].toString()));
        await userContext.getBalance();
        await userContext.getAllPools();
        await userContext.getAllStakes();
        getClaimAmounts();
        onClose();
        successToast("Successfully Claimed", `Claimed ${claimAmount} $APE!`);
      }
    } catch (error) {
      setIsClaiming(false);
      if (error.message.includes("not owned by caller")) {
        errorToast("Cannot Batch Claim", "One or more NFTs is not owned by this wallet.");
        return;
      }
      errorToast("An Error Occurred", "An error occurred while claiming");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        mt="250px"
        maxW="40rem"
        gap="8"
        mx={{ md: "5rem", sm: "2rem", base: "1rem" }}
        backgroundColor="transparent"
      >
        <Box
          backgroundColor="rgba(18, 22, 33, 0.99)"
          border="1px solid rgba(230, 230, 230, 0.1)"
          borderRadius={"12px"}
          px={{ md: "6", base: "4" }}
          pb="7"
          pt="4"
          pos="relative"
          w="100%"
          fontFamily={"Space Mono, monospace"}
        >
          <Stack gap="3">
            <Text fontWeight="bold" textAlign="center">
              AVAILABLE REWARDS
            </Text>
            <RadioGroup colorScheme="red" onChange={setValue} value={value}>
              <Stack border="1px solid rgba(233, 233, 233, 0.3)" px="3" py="4" borderRadius="6px" gap="2">
                <Flex
                  justifyContent="space-between"
                  bg="rgba(228, 228, 228, 0.1)"
                  gap="2"
                  fontSize={{ lg: "base", base: "sm" }}
                  border="1px solid #b0005a"
                  align="center"
                  rounded="100"
                  py="1"
                  px="4"
                >
                  <Radio value="0" defaultChecked>
                    <Text ml="1" fontSize={{ lg: "base", base: "sm" }}>
                      Rewards in $ApeCoin Pool
                    </Text>
                  </Radio>
                  <Text fontWeight="bold">
                    {Object.keys(claimableAmounts).length !== 0 &&
                      formatAmount(ethers.utils.formatEther(claimableAmounts?.["0"]), 4)}
                  </Text>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  gap="2"
                  fontSize={{ lg: "base", base: "sm" }}
                  bg="rgba(228, 228, 228, 0.1)"
                  align="center"
                  border="1px solid #b0005a"
                  rounded="100"
                  py="1"
                  px="4"
                >
                  <Radio value="1">
                    <Text ml="1" fontSize={{ lg: "base", base: "sm" }}>
                      Rewards in BAYC Pool
                    </Text>
                  </Radio>
                  <Text fontWeight="bold">
                    {" "}
                    {Object.keys(claimableAmounts).length !== 0 &&
                      formatAmount(ethers.utils.formatEther(claimableAmounts?.["1"]), 4)}
                  </Text>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  gap="2"
                  fontSize={{ lg: "base", base: "sm" }}
                  bg="rgba(228, 228, 228, 0.1)"
                  align="center"
                  border="1px solid #b0005a"
                  rounded="100"
                  py="1"
                  px="4"
                >
                  <Radio value="2">
                    <Text ml="1" fontSize={{ lg: "base", base: "sm" }}>
                      Rewards in MAYC Pool
                    </Text>
                  </Radio>

                  <Text fontWeight="bold">
                    {" "}
                    {Object.keys(claimableAmounts).length !== 0 &&
                      formatAmount(ethers.utils.formatEther(claimableAmounts?.["2"]), 4)}
                  </Text>
                </Flex>

                <Flex
                  justifyContent="space-between"
                  gap="2"
                  fontSize={{ lg: "base", base: "sm" }}
                  bg="rgba(228, 228, 228, 0.1)"
                  align="center"
                  border="1px solid #b0005a"
                  rounded="100"
                  py="1"
                  px="4"
                >
                  <Radio value="3">
                    <Text ml="1" fontSize={{ lg: "base", base: "sm" }}>
                      Rewards in Pair Pool
                    </Text>
                  </Radio>
                  <Text fontWeight="bold">
                    {" "}
                    {Object.keys(claimableAmounts).length !== 0 &&
                      formatAmount(ethers.utils.formatEther(claimableAmounts?.["3"]), 4)}
                  </Text>
                </Flex>
              </Stack>
            </RadioGroup>
            <Flex justifyContent="space-between" flexDirection={{ base: "column", lg: "row" }} gap="3">
              <Stack fontWeight="bold" gap="-1">
                <Text>$APE Balance</Text>
                <Text>{formatAmount(ethers.utils.formatEther(userContext?.balance?.toString()), 4)}</Text>
              </Stack>
              <Button
                fontFamily={"Space Mono, monospace"}
                bgColor="#FF0083"
                px="24"
                py="7"
                borderRadius="6px"
                fontWeight="bold"
                _hover={{
                  backgroundColor: "#ed007b",
                }}
                _active={{
                  backgroundColor: "#d4006e",
                }}
                isLoading={isClaiming}
                loadingText={"Claiming"}
                onClick={claim}
              >
                Claim
              </Button>
            </Flex>
          </Stack>
        </Box>
      </ModalContent>
    </Modal>
  );
};
