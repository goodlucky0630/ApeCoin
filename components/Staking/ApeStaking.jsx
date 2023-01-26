import { CardWrapper } from "../Card/CardWrapper";
import { Stack, Heading, SimpleGrid, Box, Flex } from "@chakra-ui/react";
import { ApeStakingStatBar } from "./ApeStakingStatBar";
import { ApeStakingTopStatBar } from "./ApeStakingTopStatBar";
import { ApeStakingButtonBox } from "./ApeStakingButtonBox";
import { useModal } from "connectkit";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import { DoubleLeftChevron } from "../Icons/DoubleLeftChevron";
import { ApeStakingUserInput } from "./ApeStakingUserInput";
import { formatAmount } from "../../utils/formatters";
import { useUserContext } from "../../contexts/User";
import { STAKING } from "../../constants/addresses";
import { STAKING_ABI } from "../../constants/abi";
import { infoToast, successToast, errorToast } from "../../pages/_app";
import { CHAIN } from "../../constants/chain";

export const ApeStaking = () => {
  const { setOpen } = useModal();
  const { address } = useAccount();
  const [isManaging, setIsManaging] = useState(false);
  const [isStakeFlow, setIsStakeFlow] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useUserContext();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const stakingInstance = useMemo(() => new ethers.Contract(STAKING, STAKING_ABI, signer), [signer]);

  useEffect(() => {
    if (!address) {
      setIsManaging(false);
    }
  }, [address]);

  const claim = async () => {
    if (!address) {
      infoToast("No Wallet Found", "Please connect wallet to claim.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (Number(userContext?.allStakes[0].claimableAmount) === 0) {
      infoToast("Nothing To Claim", "Currently do not have $APE to claim.");
      return;
    }
    try {
      setIsLoading(true);
      const claimApe = await stakingInstance.claimSelfApeCoin();
      const result = await claimApe.wait();
      if (result.status === 1) {
        setIsLoading(false);
        const claimAmount = formatAmount(ethers.utils.formatEther(userContext?.allStakes[0].claimableAmount));
        successToast("Successfully Claimed", `Claimed ${claimAmount} $APE!`);
        await userContext.getBalance();
        await userContext.getAllPools();
        await userContext.getAllStakes();
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      errorToast("Error", "An error occurred while claiming.");
    }
  };

  const btnText = () => {
    if (!address) {
      return "Connect Wallet";
    }
    if (address && !isManaging) {
      return "Manage Stake";
    }
    if (address && isManaging) {
      return "Stake";
    }
  };

  const goBack = () => {
    if (isStakeFlow) {
      setIsStakeFlow(false);
      return;
    }
    if (isManaging) {
      setIsManaging(false);
    }
  };

  const stakeBtnFns = () => {
    if (!address) {
      setOpen(true);
      return;
    }
    if (address && !isManaging) {
      setIsManaging(true);
      return;
    }
    if (address && isManaging && !isStakeFlow) {
      setIsStakeFlow(true);
      setIsUnstaking(false);
    }
  };

  const unstakeBtnFns = () => {
    if (!address) {
      setOpen(true);
      return;
    }

    if (address && !isManaging) {
      setIsManaging(true);
      return;
    }
    if (address && isManaging && !isStakeFlow) {
      setIsStakeFlow(true);
      setIsUnstaking(true);
    }
  };

  const getClaimAmount = () => {
    if (!address || !userContext?.allStakes) return "-";

    return formatAmount(ethers.utils.formatEther(userContext?.allStakes[0].claimableAmount));
  };

  return (
    <CardWrapper w="fit-content">
      <Stack align="center" h="fit-content" color="white" gap="4" spacing="0">
        <>
          <ApeStakingTopStatBar animation="fadeIn .75s" />
        </>
        <Flex alignItems={"center"} justifyContent={"space-between"} w="full" gap="4">
          {isManaging ? <BackButton onClick={goBack} /> : <Box w="20px" />}
          <Heading textAlign={"center"} fontFamily={"Space Mono, monospace"}>
            ApeCoin Staking Pool
          </Heading>
          <Box />
        </Flex>
        {!isStakeFlow ? (
          <>
            <ApeStakingStatBar animation="fadeIn .75s" />
            <SimpleGrid animation="fadeIn .75s" columns={{ base: 1, md: 2 }} w="full" gap="4">
              <ApeStakingButtonBox
                title="$APE Claimed"
                data={
                  address && userContext?.allStakes
                    ? formatAmount(ethers.utils.formatEther(userContext?.allStakes[0].apeClaimed))
                    : "0"
                }
                buttonText={btnText()}
                onClick={stakeBtnFns}
                hasButtonBorder={!address ? true : false}
                shouldChangeBtnColor={true}
                changeColor={address !== undefined}
              />
              <ApeStakingButtonBox
                title={!isManaging ? "Pending Rewards" : "Your Staked $APE"}
                data={
                  !isManaging
                    ? getClaimAmount()
                    : formatAmount(ethers.utils.formatEther(userContext?.allStakes[0].stakedAmount))
                }
                buttonText={!isManaging ? "Claim" : "Unstake"}
                hasButtonBorder={true}
                onClick={!isManaging ? () => claim() : unstakeBtnFns}
                shouldChangeStatColor={address !== null}
                changeColor={address !== undefined}
                isLoading={isLoading}
                loadingText={"Claiming"}
              />
            </SimpleGrid>
          </>
        ) : (
          <Box w="full" animation="fadeIn .75s">
            <ApeStakingUserInput isUnstaking={isUnstaking} backToManage={() => setIsStakeFlow(false)} />
          </Box>
        )}
      </Stack>
    </CardWrapper>
  );
};

const BackButton = (props) => {
  const { onClick, ...rest } = props;
  return (
    <Box {...rest} animation="fadeIn .75s" onClick={onClick} cursor="pointer">
      <DoubleLeftChevron />
    </Box>
  );
};
