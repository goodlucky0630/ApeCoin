import { Stack, Flex, Box, Text, Image, Skeleton } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { useUserContext } from "../../contexts/User";
import { formatAmount } from "../../utils/formatters";
import { BAYC, MAYC, BAKC } from "../../constants/addresses";
import { useGetImage } from "../../hooks/useGetImage";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const poolIds = {
  [BAYC.toLowerCase()]: "1",
  [MAYC.toLowerCase()]: "2",
  [BAKC.toLowerCase()]: "3",
};

export const LendingCard = (props) => {
  const { vault, ...rest } = props;
  const userContext = useUserContext();
  // const { address } = useAccount();
  const poolId = vault?.inventory?.length > 0 ? poolIds[vault?.inventory[0]?.contract] : "";
  const tokenId = vault?.inventory?.length > 0 ? vault?.inventory[0]?.tokenId : "";
  const { data, isLoaded, isLoading } = useGetImage(poolId, tokenId);
  const [floor, setFloor] = useState(undefined);
  const [valuation, setValuation] = useState(undefined);
  const router = useRouter();
  // const isVaultPage = router?.isReady && router?.pathname.slice(1, 6) === "vault";
  const [isInLoan, setIsInLoan] = useState(undefined);

  const getLoanStatus = async () => {
    try {
      const statuses = await axios.get("/api/getVaultStatus", {
        params: {
          vaultTokenId: vault?.vaultTokenId,
        },
      });
      const isAccepted = statuses?.data?.filter((i) => i?.status === "ACCEPTED");
      setIsInLoan(isAccepted?.length === 1 ? true : false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (vault && vault?.vaultTokenId && isInLoan === undefined) {
      getLoanStatus();
    }
  }, [vault, isInLoan]);

  const calcTotalFloor = () => {
    let total = BigNumber.from("0");
    for (let i = 0; i < vault?.inventory.length; i++) {
      const poolId = poolIds[vault?.inventory[i]?.contract];
      const floor = userContext?.floorData[poolId] || "0";
      total = total.add(BigNumber.from(floor));
    }
    const formattedFloor = formatAmount(ethers.utils.formatEther(total.toString()), 2);
    setFloor(formattedFloor);
    setValuation(formattedFloor);
  };

  useEffect(() => {
    if (userContext?.floorData && vault && vault?.inventory?.length > 0 && (!floor || !valuation)) {
      calcTotalFloor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault, floor, valuation, userContext]);

  return (
    <Flex gap="3" {...rest}>
      {vault?.inventory?.length > 1 && (
        <Flex
          flexDir="column"
          gap="3"
          justifyContent="start"
          overflowY={"auto"}
          maxH="280"
          pr="1"
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
          {vault?.inventory?.length > 1 &&
            vault?.inventory
              .slice(1, vault.inventory.length)
              .map((i, idx) => <SmallImage key={idx} contractAddress={i.contract} tokenId={i.tokenId} />)}
        </Flex>
      )}
      {vault?.inventory?.length > 0 ? (
        <Skeleton isLoaded={isLoaded && !isLoading} width="100%" height="280">
          <Box
            backgroundImage={data?.imageURL && isLoaded && !isLoading && data?.imageURL}
            bgPosition="center"
            bgSize="cover"
            bgRepeat="no-repeat"
            width="100%"
            height="280"
            p="3"
            borderRadius={"6"}
            pos="relative"
          >
            {isInLoan && (
              <Box bg="limegreen" w="fit-content" px="3" borderRadius={"md"} fontWeight="bold">
                In Loan
              </Box>
            )}
            <Flex
              justifyContent={"space-between"}
              flexWrap="wrap"
              gap="4"
              pos="absolute"
              bottom="0"
              w="100%"
              pl="3"
              pr="9"
              pb="3"
            >
              <Stack backdropFilter={"blur(10px)"} borderRadius="md">
                <Text fontSize="sm" fontFamily={"Space Mono, monospace"}>
                  Floor:
                </Text>
                <Flex gap="2" align="center">
                  <Image src={"/images/ethereum.svg"} alt="ApeCoin" width={"6"} height={"6"} />
                  <Text as="b" fontFamily={"Space Mono, monospace"} fontSize="xl">
                    {floor}
                  </Text>
                </Flex>
              </Stack>
              <Stack backdropFilter={"blur(10px)"} borderRadius="md">
                <Text fontSize="sm" fontFamily={"Space Mono, monospace"}>
                  Valuation:
                </Text>
                <Flex gap="2" align="center">
                  <Image src={"/images/ethereum.svg"} alt="ApeCoin" width={"6"} height={"6"} />
                  <Text as="b" fontFamily={"Space Mono, monospace"} fontSize="xl">
                    {valuation}
                  </Text>
                </Flex>
              </Stack>
            </Flex>
          </Box>
        </Skeleton>
      ) : (
        <Box
          bgColor="rgba(255,255,255, .1)"
          width="100%"
          height="280"
          p="3"
          borderRadius={"6"}
          pos="relative"
        >
          <Flex
            justifyContent={"space-between"}
            flexWrap="wrap"
            gap="4"
            pos="absolute"
            bottom="0"
            w="100%"
            pl="3"
            pr="9"
            pb="3"
          >
            <Box>No Items In Vault.</Box>
          </Flex>
        </Box>
      )}
    </Flex>
  );
};

const SmallImage = (props) => {
  const { tokenId, contractAddress, handleClick, ...rest } = props;
  const poolId = poolIds[contractAddress];
  const { data, isLoading, isLoaded } = useGetImage(poolId, tokenId);

  return (
    <Skeleton isLoaded={isLoaded && !isLoading}>
      <Image alt="" {...rest} boxSize="60px" src={data?.imageURL} objectFit="cover" borderRadius="6px" />
    </Skeleton>
  );
};
