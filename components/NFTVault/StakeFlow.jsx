import { HStack, Stack, Box } from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import { useUserContext } from "../../contexts/User";
import { CardWrapper } from "../Card/CardWrapper";
import { StakedChart } from "../Charts/StakedChart";
import { Next } from "../Icons/Next";
import { ChosenCard } from "./ChosenCard";
import { ChosenNFTStakeStats } from "./ChosenNFTStakeStats";
import { StakeFlowActions } from "./StakeFlowActions";
import { StakeInput } from "./StakeInput";

export const StakeFlow = ({
  next,
  prev,
  poolData,
  poolDataIsLoading,
  poolDataIsError,
}) => {
  const ref = useRef();
  const overLayRef = useRef();
  const userContext = useUserContext();
  const [windowWidth, setWindowWidth] = useState();
  const [showInput, setShowInput] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const handleSetShowInput = (show, bool) => {
    setShowInput(show);
    setIsUnstaking(bool);
  };

  const chosenNFT = userContext.allStakes.filter(
    (i) =>
      i.poolId === userContext.nftVaultState.poolId &&
      (userContext.nftVaultState.poolId === "3"
        ? i.tokenId === userContext.nftVaultState.dogTokenId
        : i.tokenId === userContext.nftVaultState.mainTokenId)
  );

  const poolCap = String(
    userContext.allPools[userContext.nftVaultState.poolId].poolCap
  );
  const setDimension = () => {
    setWindowWidth(window?.innerWidth);
  };

  useEffect(() => {
    setDimension();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", setDimension);
    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, [windowWidth]);

  return (
    <HStack
      spacing="0"
      flexDirection={{ base: "column", md: "row" }}
      gap="6"
      w="full"
      fontFamily={"Space Mono, monospace"}
      justifyContent="space-between"
      position={"relative"}
      alignItems="self-start"
      p="4"
      ref={ref}
    >
      <Box
        transform={"rotate(180deg)"}
        cursor={"pointer"}
        position="absolute"
        left="-3rem"
        top="50%"
        onClick={prev}
        _active={{
          transform: "scale(.9) rotate(180deg)",
        }}
      >
        <Next />
      </Box>
      <ChosenCard
        parentWidth={ref?.current?.offsetWidth}
        parentHeight={ref?.current?.offsetHeight}
        mainTokenId={
          userContext.nftVaultState.poolId === "3"
            ? chosenNFT[0]?.mainTokenId
            : chosenNFT[0]?.tokenId
        }
        mainTypePoolId={chosenNFT[0]?.mainTypePoolId}
        poolId={chosenNFT[0]?.poolId}
        dogTokenId={
          userContext.nftVaultState.poolId === "3" ? chosenNFT[0]?.tokenId : ""
        }
        stakedAmount={chosenNFT[0]?.stakedAmount}
        poolCap={poolCap}
      />
      <Stack
        w={{ base: "full", md: "50%", lg: "60%" }}
        ref={overLayRef}
        spacing="4"
      >
        {showInput ? (
          <CardWrapper animation="fadeIn .75s">
            <StakeInput
              chosenNFT={chosenNFT[0]}
              isUnstaking={isUnstaking}
              handleSetShowInput={handleSetShowInput}
              overLayRef={overLayRef}
            />
          </CardWrapper>
        ) : (
          <>
            <ChosenNFTStakeStats
              stakedAmount={chosenNFT[0]?.stakedAmount}
              rewards24hr={chosenNFT[0]?.rewards24hr}
              claimableAmount={chosenNFT[0]?.claimableAmount}
              endDate={userContext?.allPools[chosenNFT[0]?.poolId].endTimestamp}
            />
            <CardWrapper animation="fadeIn .75s">
              <StakedChart chartData={poolData[chosenNFT[0]?.poolId]} />
            </CardWrapper>
          </>
        )}
        <StakeFlowActions
          chosenNFT={chosenNFT[0]}
          handleSetShowInput={handleSetShowInput}
          showInput={showInput}
          isUnstaking={isUnstaking}
        />
      </Stack>
      <Box
        onClick={next}
        cursor={"pointer"}
        position="absolute"
        right="-3rem"
        top="50%"
        _active={{
          transform: "scale(.9)",
        }}
      >
        <Next />
      </Box>
    </HStack>
  );
};
