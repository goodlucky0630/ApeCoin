import {
  Stack,
  FormControl,
  Flex,
  Input,
  FormLabel,
  Box,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { useUserContext } from "../../contexts/User";
import { ApeCoinLogo } from "../Icons/ApeCoinLogo";
import { ethers, utils } from "ethers";
import { formatAmount } from "../../utils/formatters";
import { ApeCoinButtonIcon } from "../Icons/ApeCoinButtonIcon";
import { STAKING } from "../../constants/addresses";
import { STAKING_ABI } from "../../constants/abi";
import { useSigner, useNetwork } from "wagmi";
import { ApeStakeConfirmStake } from "./ApeStakeConfirmStake";
import { useRef, useState, useEffect, useMemo } from "react";
const bigDecimal = require("js-big-decimal");
import { errorToast, infoToast } from "../../pages/_app";
import { CHAIN } from "../../constants/chain";

export const ApeStakingUserInput = ({ backToManage, isUnstaking }) => {
  const userContext = useUserContext();
  const { data: signer } = useSigner();
  const [amount, setAmount] = useState("");
  const amountRef = useRef("");
  const { chain } = useNetwork();
  const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);
  const ref = useRef(null);
  const [windowWidth, setWindowWidth] = useState();
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const stakingInstance = useMemo(
    () => new ethers.Contract(STAKING, STAKING_ABI, signer),
    [signer]
  );

  const deposit = async () => {
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (Number(amount) < 1) {
      infoToast("Amount Too Small", "Minimum stake amount is 1 $APE");
      return;
    }
    try {
      setIsLoading(true);
      const deposit = await stakingInstance.depositSelfApeCoin(
        ethers.utils.parseEther(amount.toString())
      );
      const result = await deposit.wait();
      if (result.status === 1) {
        amountRef.current = amount;
        setIsSuccess(true);
        setIsLoading(false);
        setTxHash(result.transactionHash);
        await userContext.getBalance();
        await userContext.getAllPools();
        await userContext.getAllStakes();
        setAmount("");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      errorToast("Error", "An error occurred while staking.");
    }
  };

  const withdraw = async () => {
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    try {
      setIsLoading(true);
      const unstaked = await stakingInstance.withdrawSelfApeCoin(
        ethers.utils.parseEther(amount.toString())
      );
      const result = await unstaked.wait();
      if (result.status === 1) {
        amountRef.current = amount;
        setIsSuccess(true);
        setIsLoading(false);
        setTxHash(result.transactionHash);
        await userContext.getBalance();
        await userContext.getAllPools();
        await userContext.getAllStakes();
        setAmount("");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      errorToast("Error", "An error occurred while unstaking.");
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

  const invalidAmount = isUnstaking
    ? Number(amount) >
      Number(
        utils.formatEther(userContext?.allStakes[0].stakedAmount?.toString())
      )
    : Number(amount) >
      Number(utils.formatEther(userContext?.balance?.toString()));

  const handleAmountButton = (percentage) => {
    const balance = isUnstaking
      ? utils.formatEther(userContext.allStakes[0].stakedAmount.toString())
      : utils.formatEther(userContext.balance.toString());
    if (Number(balance) === 0) return;
    if (percentage === 25) {
      let quarter = bigDecimal.divide(balance, "4");
      setAmount(quarter);
      amountRef.current = quarter;
    }
    if (percentage === 50) {
      let half = bigDecimal.divide(balance, "2");
      setAmount(half);
      amountRef.current = half;
    }
    if (percentage === 75) {
      let quarter = bigDecimal.divide(balance, "4");
      let threeQuarter = bigDecimal.multiply(quarter, "3");
      setAmount(threeQuarter);
      amountRef.current = threeQuarter;
    }
    if (percentage === 100) {
      setAmount(balance);
      amountRef.current = balance;
    }
    setDimension();
  };

  const handleAmountInput = (e) => {
    setAmount(e.target.value);
    amountRef.current = e.target.value;
    setDimension();
  };

  const approve = async () => {
    await userContext.approveSpender(STAKING);
    await userContext.getAllowance();
  };

  const close = () => {
    setShowConfirmOverlay(false);
    setIsSuccess(false);
  };

  return (
    <Stack ref={ref} position="relative" spacing="0" maxH="fit-content">
      <Stack
        position="relative"
        border="1px solid rgba(233, 233, 233, 0.3)"
        borderRadius={"6px"}
        fontFamily={"Space Mono, monospace"}
        spacing="0"
        gap="4"
        px="3"
        py="2"
      >
        <FormControl>
          <FormLabel fontSize={"xs"} fontWeight="400">
            Amount
          </FormLabel>
          <Flex
            alignItems={"center"}
            px="2"
            borderRadius={"3px"}
            border="1px solid rgba(17, 69, 233, 0.5)"
            bg="rgba(228, 228, 228, 0.1)"
            justifyContent="space-between"
          >
            <Input
              bg="transparent"
              type="number"
              _focusVisible={{ border: "none" }}
              border="none"
              placeholder="0.0"
              fontWeight={700}
              fontSize="xl"
              px="0"
              boxShadow={"none"}
              value={amount}
              onChange={handleAmountInput}
              disabled={isLoading}
            />
            <ApeCoinLogo width="30px" height="30px" />
          </Flex>
          {invalidAmount && (
            <Box color="red.300">
              {isUnstaking
                ? "Amount higher than staked amount."
                : "Amount higher than wallet balance."}
            </Box>
          )}
        </FormControl>
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          justifyContent="space-between"
          gap="4"
        >
          <Flex
            flexDirection={{ base: "row", md: "column" }}
            justifyContent={{ base: "space-between", md: "space-around" }}
            gap="4"
            alignItems={"flex-start"}
          >
            <SimpleGrid columns={{ base: 2, sm: 4 }} gap="2">
              <AmountButton
                buttonText="25%"
                onClick={() => handleAmountButton(25)}
              />
              <AmountButton
                buttonText="50%"
                onClick={() => handleAmountButton(50)}
              />
              <AmountButton
                buttonText="75%"
                onClick={() => handleAmountButton(75)}
              />
              <AmountButton
                buttonText="MAX"
                onClick={() => handleAmountButton(100)}
                isMax={true}
              />
            </SimpleGrid>
            <Stack spacing={"1"}>
              <Box fontSize={"sm"}>
                {isUnstaking ? "$APE Staked:" : "$APE Balance:"}
              </Box>
              <Box fontSize={"lg"} fontWeight="700">
                {isUnstaking
                  ? formatAmount(
                      utils.formatEther(
                        userContext?.allStakes[0].stakedAmount.toString()
                      ),
                      6
                    )
                  : formatAmount(
                      utils.formatEther(userContext.balance.toString()),
                      6
                    )}
              </Box>
            </Stack>
          </Flex>
          <Flex
            flexDirection="column"
            justifyContent="space-between"
            alignItems={"center"}
            gap="4"
          >
            <ApproveButton
              w="full"
              isDisabled={
                invalidAmount ||
                amount === "" ||
                Number(amount) <=
                  Number(utils.formatEther(userContext?.allowance?.toString()))
              }
              isActive={
                Number(amount) >
                Number(utils.formatEther(userContext?.allowance?.toString()))
              }
              onClick={approve}
              isLoading={userContext.approvalIsLoading}
            />
            <StakeButton
              w="full"
              isActive={
                amount !== "" &&
                Number(amount) <=
                  Number(utils.formatEther(userContext?.allowance?.toString()))
              }
              isDisabled={
                invalidAmount ||
                amount === "" ||
                Number(amount) >
                  Number(utils.formatEther(userContext?.allowance?.toString()))
              }
              onClick={() => {
                setDimension();
                setShowConfirmOverlay(true);
              }}
              buttonText={isUnstaking ? "Unstake" : "Stake"}
            />
          </Flex>
        </Flex>
      </Stack>
      {showConfirmOverlay && (
        <ApeStakeConfirmStake
          width={`${ref.current.offsetWidth}px`}
          height={`${ref.current.offsetHeight}px`}
          boxHeight={ref.current.offsetHeight}
          close={close}
          stakeAmount={formatAmount(amountRef.current, 18)}
          isSuccess={isSuccess}
          isUnstaking={isUnstaking}
          contractCall={isUnstaking ? withdraw : deposit}
          isLoading={isLoading}
          txHash={txHash}
          backToManage={backToManage}
        />
      )}
    </Stack>
  );
};

const AmountButton = (props) => {
  const { buttonText, onClick, isMax, ...rest } = props;
  return (
    <Button
      {...rest}
      borderRadius={"full"}
      size="xs"
      fontWeight={isMax ? "600" : "400"}
      onClick={onClick}
      border={isMax ? "none" : "0.4px solid rgba(230, 230, 230, 0.5)"}
      px="2"
      bgColor={isMax && "#FF0083"}
    >
      {buttonText}
    </Button>
  );
};

const ApproveButton = (props) => {
  const { buttonText, onClick, isActive, ...rest } = props;

  return (
    <Button
      {...rest}
      loadingText="Approving"
      boxShadow={isActive && "0px 8px 24px rgba(255, 0, 131, 0.64)"}
      border="1px solid rgba(230, 230, 230, 0.1)"
      bgColor={isActive ? "#FF0083" : "#2D3042"}
      borderRadius={"6px"}
      p="6"
      onClick={onClick}
      backgroundColor={isActive ? "#FF0083" : "rgba(228, 228, 228, 0.1)"}
      _hover={{
        backgroundColor: isActive ? "#ed007b" : "rgba(228, 228, 228, 0.15)",
      }}
      _active={{
        backgroundColor: isActive ? "#d4006e" : "rgba(228, 228, 228, 0.07)",
      }}
    >
      Approve
    </Button>
  );
};

const StakeButton = (props) => {
  const { buttonText, onClick, isActive, ...rest } = props;

  return (
    <Button
      {...rest}
      boxShadow={isActive && "0px 8px 24px rgba(255, 0, 131, 0.64)"}
      border="1px solid rgba(230, 230, 230, 0.1)"
      bgColor={isActive ? "#FF0083" : "#2D3042"}
      borderRadius={"6px"}
      px="6"
      py="10"
      backgroundColor={isActive ? "#FF0083" : "rgba(228, 228, 228, 0.1)"}
      _hover={{
        backgroundColor: isActive ? "#ed007b" : "rgba(228, 228, 228, 0.15)",
      }}
      _active={{
        backgroundColor: isActive ? "#d4006e" : "rgba(228, 228, 228, 0.07)",
      }}
      leftIcon={<ApeCoinButtonIcon />}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
};
