import { useUserContext } from "../../contexts/User";
import { Stack, Box, HStack, Progress, Skeleton } from "@chakra-ui/react";
import { Slider } from "./Slider";
import { formatAmount } from "../../utils/formatters";
import { utils } from "ethers";
import { useGetImage } from "../../hooks/useGetImage";

const bigDecimal = require("js-big-decimal");
export const nftName = {
  1: "BAYC",
  2: "MAYC",
  3: "BAKC",
};
export const ApeAmountForNFT = (props) => {
  const {
    isUnstaking,
    isLoading,
    poolCap,
    chosenNFT,
    maxStakeAmount,
    amountRef,
    ...rest
  } = props;
  const userContext = useUserContext();

  const handleAmountInputSlider = (e) => {
    userContext.dispatch({
      type: "HANDLE_APE_AMOUNT",
      payload: e.toString(),
    });
    amountRef.current = e.toString();
  };

  const maxAmount = () => {
    userContext.dispatch({
      type: "HANDLE_APE_AMOUNT",
      payload: maxStakeAmount.toString(),
    });
    amountRef.current = maxStakeAmount.toString();
  };
  return (
    <Stack h="full" justifyContent={"space-around"} animation={"fadeIn .75s"}>
      <HStack
        spacing={"4"}
        alignItems={"start"}
        p="2"
        justifyContent="space-between"
      >
        <NFTCard
          poolCap={poolCap}
          stakedAmount={chosenNFT.stakedAmount}
          poolId={userContext.state.poolId}
          dogTokenId={userContext.state.dogTokenId}
          mainTokenId={userContext.state.mainTokenId}
          mainTypePoolId={userContext.state.mainTypePoolId}
        />
        <Stack w="full" justifyContent={"space-between"} h="full">
          <Stack w="full">
            <Box fontSize={"xs"} fontWeight="400">
              {userContext?.state?.poolId === "3"
                ? `BAKC #${userContext?.state.dogTokenId}/${
                    nftName[userContext.state.mainTypePoolId]
                  } #${userContext.state.mainTokenId}`
                : `${nftName[userContext.state.poolId]} #${
                    userContext.state.mainTokenId
                  }`}
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
              {userContext.state.apeAmount}
            </Box>
          </Stack>
          <Stack spacing={"1"}>
            <Box fontSize={"sm"}>{"$APE Balance:"}</Box>
            <Box fontSize={"lg"} fontWeight="700">
              {formatAmount(
                utils.formatEther(userContext.balance.toString()),
                6
              )}
            </Box>
          </Stack>
        </Stack>
      </HStack>
      <Slider
        px="4"
        spacing={"6"}
        onChange={handleAmountInputSlider}
        value={Number(userContext.state.apeAmount)}
        max={Number(maxStakeAmount)}
        maxAmount={maxAmount}
      />
    </Stack>
  );
};

const NFTCard = (props) => {
  const userContext = useUserContext();
  const {
    mainTokenId,
    mainTypePoolId,
    stakedAmount,
    poolId,
    poolCap,
    dogTokenId,
    ...rest
  } = props;
  const { data: mainTokenURL, isLoaded: isMainLoaded } = useGetImage(
    userContext.state.poolId === "3" ? mainTypePoolId : poolId,
    mainTokenId
  );
  const { data: dogTokenURL, isLoaded: isDogLoaded } = useGetImage(
    poolId,
    dogTokenId
  );

  const percentage = bigDecimal.multiply(
    bigDecimal.divide(stakedAmount, poolCap),
    "100"
  );
  return (
    <Skeleton
      isLoaded={
        userContext.state.poolId === "3"
          ? isMainLoaded && isDogLoaded
          : isMainLoaded
      }
    >
      <Box
        {...rest}
        border={"1px solid #FF0083"}
        borderRadius={"3px"}
        position="relative"
        bgImage={mainTokenURL?.imageURL}
        minW="125px"
        height={"175px"}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        bgSize={"cover"}
        display="flex"
        alignItems={"flex-end"}
      >
        {userContext.state.poolId === "3" && (
          <Box
            border={"1px solid #FF0083"}
            borderRadius={"3px"}
            position="absolute"
            top="0"
            bgImage={dogTokenURL?.imageURL}
            width="50px"
            height={"75px"}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            bgSize={"cover"}
          />
        )}
        <Box display="flex" alignItems={"flex-end"} h="full" w="full">
          <Stack
            w="full"
            spacing="1"
            p="2"
            backdropFilter="blur(2px)"
            bgColor="rgba(0,0,0,.4)"
          >
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
            <Box fontWeight={"700"} fontSize="10px">
              {formatAmount(percentage, 3) + "%"} Filled
            </Box>
          </Stack>
        </Box>
      </Box>
    </Skeleton>
  );
};
