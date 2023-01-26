import { CardWrapper } from "../Card/CardWrapper";
import { Stack, Heading, SimpleGrid, Box, Flex } from "@chakra-ui/react";
import { CompoundStatBar } from "./CompoundStatBar";
import { CompoundApyStatBar } from "./CompoundApyStatBar";
import { CompoundVerichains } from "./CompoundVerichains";
import { ApeStakingButtonBox } from "../Staking/ApeStakingButtonBox";
import { useModal } from "connectkit";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import { DoubleLeftChevron } from "../Icons/DoubleLeftChevron";
import { CompoundUserInput } from "./CompoundUserInput";
import { formatAmount } from "../../utils/formatters";
import { useUserContext } from "../../contexts/User";
import { infoToast, successToast, errorToast } from "../../pages/_app";
import { CHAIN } from "../../constants/chain";

export const AutoCompoundComp = () => {
  const { setOpen } = useModal();
  const { address } = useAccount();
  const [isManaging, setIsManaging] = useState(false);
  const [isStakeFlow, setIsStakeFlow] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useUserContext();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const btnText = () => {
    if (!address) {
      return "Connect Wallet";
    }
    if (address) {
      return "Stake";
    }
  };

  const goBack = () => {
    if (isStakeFlow) {
      setIsStakeFlow(false);
      return;
    }
  };

  const stakeBtnFns = () => {
    if (!address) {
      setOpen(true);
      return;
    }
    if (address && !isStakeFlow) {
      setIsStakeFlow(true);
      setIsUnstaking(false);
    }
  };

  const unstakeBtnFns = () => {
    if (!address) {
      setOpen(true);
      return;
    }
    if (address && !isStakeFlow) {
      setIsStakeFlow(true);
      setIsUnstaking(true);
    }
  };

  return (
    <CardWrapper>
      <Stack align="center" h="fit-content" color="white" gap="4" spacing="0">
        <Flex alignItems={"center"} justifyContent={"space-between"} w="full" gap="4">
          {isStakeFlow ? <BackButton onClick={goBack} /> : <Box w="20px" />}
          <Heading textAlign={"center"} fontFamily={"Space Mono, monospace"}>
            Auto-Compounding Pool
          </Heading>
          <Box />
        </Flex>
        {!isStakeFlow ? (
          <>
            {/* <CompoundStatBar animation="fadeIn .75s" /> */}
            <CompoundVerichains animation="fadeIn .75s" />
            <CompoundApyStatBar animation="fadeIn .75s" />
            <SimpleGrid animation="fadeIn .75s" columns={{ base: 1, md: 2 }} w="full" gap="4">
              <ApeStakingButtonBox
                title="Stakable $APE"
                data={
                  address && userContext?.balance
                    ? formatAmount(ethers.utils.formatEther(userContext?.balance || "0"))
                    : "0"
                }
                buttonText={btnText()}
                onClick={stakeBtnFns}
                hasButtonBorder={!address ? true : false}
                shouldChangeBtnColor={true}
                changeColor={address !== undefined}
              />
              <ApeStakingButtonBox
                title={"Your Compounding $APE"}
                data={
                  address && userContext?.balance
                    ? formatAmount(ethers.utils.formatEther(userContext?.compoundBalance || "0"))
                    : "0"
                } //get amount deposited into compounder
                buttonText={"Unstake"}
                hasButtonBorder={true}
                onClick={unstakeBtnFns}
                shouldChangeStatColor={address !== null}
                changeColor={address !== undefined}
                isLoading={isLoading}
                loadingText={"Unstaking"}
              />
            </SimpleGrid>
          </>
        ) : (
          <Box w="full" animation="fadeIn .75s">
            <CompoundUserInput isUnstaking={isUnstaking} backToManage={() => setIsStakeFlow(false)} />
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
