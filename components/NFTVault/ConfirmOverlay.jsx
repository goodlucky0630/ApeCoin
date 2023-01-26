import {
  Stack,
  Box,
  Flex,
  Button,
  ButtonGroup,
  SimpleGrid,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { ApeInfo } from "../Icons/ApeInfo";
import { AiOutlineCloudServer, AiOutlineTwitter } from "react-icons/ai";
import { useUserContext } from "../../contexts/User";
import BlueButton from "../Buttons/BlueButton";
const nftName = {
  1: "BAYC",
  2: "MAYC",
  3: "BAKC",
};
export const ConfirmOverlay = (props) => {
  const {
    close,
    contractCall,
    isUnstaking,
    isSuccess,
    isLoading,
    txHash,
    boxHeight,
    stakeAmount,
    ...rest
  } = props;
  const userContext = useUserContext();

  const shareTwitter = () => {
    const site = window.location.href;
    const tweet = `https://twitter.com/intent/tweet?text=I%20just%20${
      isUnstaking ? "unstaked" : "staked"
    }%20${stakeAmount.toString()}%20ApeCoin%20${
      isUnstaking
        ? `from%20the%20${nftName[userContext.nftVaultState.poolId]}`
        : `in%20the%20${nftName[userContext.nftVaultState.poolId]}`
    }%20pool%20on%20apecoinstaking.io!&hashtags=nf3%2Capecoin%2Capecoinstaking&url=${site}`;
    const left = screen.width / 3;
    const top = screen.height / 3;
    const width = screen.width / 3;
    const height = screen.height / 3;
    window.open(
      tweet,
      "popup",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return (
    <Stack
      {...rest}
      border="1px solid rgba(233, 233, 233, 0.3)"
      borderRadius={"6px"}
      p="4"
      fontFamily={"Space Mono, monospace"}
      spacing="0"
      gap="4"
      bg="linear-gradient(0deg, rgba(0, 0, 0, 0.54), rgba(0, 0, 0, 0.54)), rgba(17, 69, 233, 0.35)"
      backdropFilter="blur(7px)"
      position={"absolute"}
      top={{ base: boxHeight / 1.4, md: "0" }}
      right="4"
      animation="fadeIn .25s"
      align={"center"}
      zIndex="2"
      justifyContent="space-between"
    >
      <CloseIcon onClick={close} cursor={"pointer"} alignSelf={"flex-end"} />
      <Stack alignItems={"center"} spacing="3">
        <Box>
          <ApeInfo />
        </Box>
        <Box
          fontWeight={700}
          fontSize={{ base: "xl", md: "2xl" }}
          textAlign="center"
        >
          {isSuccess
            ? `Successfully ${
                isUnstaking ? "Withdrawn From" : "Deposited Into"
              } Pool!`
            : "Confirm Your Transaction"}
        </Box>
      </Stack>
      {!isSuccess ? (
        <Stack spacing="4">
          <Box
            w={"full"}
            bg="#2D3042"
            border="1px solid rgba(17, 69, 233, 0.5)"
            borderRadius={"3px"}
            px="2"
          >
            I want to {isUnstaking ? "unstake" : "stake"} {stakeAmount} of my
            $APE {isUnstaking ? "from" : "in"} the{" "}
            {nftName[userContext.nftVaultState.poolId]} Staking Pool.
          </Box>
          <BlueButton
            isLoading={isLoading}
            loadingText={isUnstaking ? "Unstaking" : "Staking"}
            buttonText="Confirm"
            onClick={contractCall}
          />
        </Stack>
      ) : (
        <SimpleGrid columns={{ base: 2, md: 3 }} gap="2">
          <Button
            border="1px solid rgba(230, 230, 230, 0.1)"
            bgColor={"#2D3042"}
            borderRadius={"6px"}
            py="4"
            w={{ base: "full", md: "initial" }}
            px="6"
            onClick={close}
            _hover={{
              backgroundColor: "#373b52",
            }}
            _active={{
              backgroundColor: "#202330",
            }}
          >
            Close
          </Button>
          <Button
            bgColor={"#34A2F2"}
            borderRadius={"6px"}
            py="4"
            w={{ base: "full", md: "initial" }}
            px="6"
            onClick={shareTwitter}
            leftIcon={<AiOutlineTwitter />}
            _hover={{
              backgroundColor: "#2f94de",
            }}
            _active={{
              backgroundColor: "#2a86c9",
            }}
          >
            Share
          </Button>
          <Button
            bgColor={"#FF0083"}
            borderRadius={"6px"}
            py="4"
            w={{ base: "full", md: "initial" }}
            px="6"
            onClick={close}
            _hover={{
              backgroundColor: "#ed007b",
            }}
            _active={{
              backgroundColor: "#d4006e",
            }}
          >
            Manage
          </Button>
        </SimpleGrid>
      )}
    </Stack>
  );
};
