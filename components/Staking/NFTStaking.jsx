import { CardWrapper } from "../Card/CardWrapper";
import { BAYC } from "../Icons/BAYC";
import { PairPool } from "../Icons/PairPool";
import { HStack, Stack, Box, Flex } from "@chakra-ui/react";
import { MAYC } from "../Icons/MAYC";
import { Wallet } from "../Icons/Wallet";
import { useState, useEffect } from "react";
import { useModal } from "connectkit";
import { useAccount } from "wagmi";
import { infoToast } from "../../pages/_app";
import { ChooseNFT } from "./ChooseNFT";
import { useUserContext } from "../../contexts/User";

export const NFTStaking = (props) => {
  const { setOpen } = useModal();
  const { address } = useAccount();
  const userContext = useUserContext();
  const [fill, setFill] = useState("transparent");

  const enterStakeFlow = (poolId) => {
    if (!address) {
      infoToast("No Wallet Found", "Please connect wallet to begin.");
      return;
    }
    userContext.dispatch({
      type: "HANDLE_IS_STAKE_FLOW",
      payload: true,
    });
    userContext.dispatch({
      type: "HANDLE_POOL",
      payload: poolId,
    });
  };

  useEffect(() => {
    if (!address) {
      userContext.dispatch({
        type: "RESET",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <CardWrapper maxW="sm" minW={{ base: "", sm: "fit-content" }} h="auto">
      {!userContext.state.isStakeFlow && (
        <Stack
          justifyContent={"space-between"}
          h="full"
          fontFamily={"Space Mono, monospace"}
          animation="fadeIn .75s"
        >
          <HStack mx="auto" spacing="0" gap="2">
            <Flex cursor={"pointer"} onClick={() => enterStakeFlow("3")}>
              <PairPool />
            </Flex>
            <Stack spacing="0" gap="1">
              <Flex cursor={"pointer"} onClick={() => enterStakeFlow("1")}>
                <BAYC />
              </Flex>
              <Flex cursor={"pointer"} onClick={() => enterStakeFlow("2")}>
                <MAYC />
              </Flex>
              <Flex
                cursor={"pointer"}
                onClick={() => setOpen(true)}
                onMouseOver={() => setFill("#FF0083")}
                onMouseOut={() => setFill("transparent")}
              >
                <Wallet fill={fill} />
              </Flex>
            </Stack>
          </HStack>
          <Flex justifyContent={"space-between"}>
            <Box fontWeight="700">
              NFT <br /> Staking Pools
            </Box>
            <Stack align={"flex-end"}>
              {/* <Box>APY</Box>
              <Box>-</Box> */}
            </Stack>
          </Flex>
        </Stack>
      )}
      {userContext.state.isStakeFlow &&
        userContext.state.poolId !== "" &&
        address && <ChooseNFT />}
    </CardWrapper>
  );
};
