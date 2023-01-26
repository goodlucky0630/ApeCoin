import { Stack, Box, Flex, Skeleton } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useUserContext } from "../../contexts/User";
import { formatAmount } from "../../utils/formatters";
const bigDecimal = require("js-big-decimal");

export const CompoundStatBar = (props) => {
  const { usersShare, ...rest } = props;
  const { address } = useAccount();
  const userContext = useUserContext();

  const getShare = () => {
    if (!userContext.compoundingData || !userContext?.allPools) return;
    const totalInPool = ethers.utils.formatEther(userContext?.allPools[0].stakedAmount);
    const userStaked = ethers.utils.formatEther(userContext?.compoundingData?.stakedAmount);
    const percent = bigDecimal.multiply(bigDecimal.divide(userStaked, totalInPool), "100");
    return `${formatAmount(percent, 4)}%`;
  };

  return (
    <Flex
      {...rest}
      border="1px solid rgba(233, 233, 233, 0.3)"
      borderRadius={"6px"}
      flexDirection={{ base: "column", md: "row" }}
      // w={{ base: "full", md: "fit-content" }}
      w="full"
    >
      <Stat
        title="Total $APE Locked"
        borderRight={{ base: "", md: "1px solid rgba(233, 233, 233, 0.3)" }}
        formattedData={
          userContext?.allPools &&
          formatAmount(ethers.utils.formatEther(userContext?.allPools[0].stakedAmount))
        }
      />
      <Stat
        title="$APE Compounded"
        borderRight={{ base: "", md: "1px solid rgba(233, 233, 233, 0.3)" }}
        formattedData={
          userContext?.compoundingData &&
          `${formatAmount(ethers.utils.formatEther(userContext?.compoundingData?.totalCompounded), 4)}`
        }
      />
      <Stat
        title="$APE Compounding"
        willChangeColor={true}
        changeColor={address !== undefined}
        formattedData={address && userContext?.compoundingData ? getShare() : "0.00%"}
      />
    </Flex>
  );
};

const Stat = (props) => {
  const { title, formattedData, willChangeColor, changeColor, ...rest } = props;
  return (
    <Stack
      {...rest}
      pt="2"
      pb={{ base: "2", md: "4" }}
      px="4"
      align={"center"}
      fontFamily={"Space Mono, monospace"}
      w="full"
    >
      <Box textAlign={"center"}>{title}</Box>
      <Skeleton isLoaded={formattedData !== undefined} w={!formattedData ? "100px" : ""}>
        <Box
          color={willChangeColor && changeColor ? "#1E54FF" : "white"}
          textShadow={willChangeColor && changeColor ? "0px 0px 7px rgba(17, 69, 233, 0.8)" : ""}
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="700"
        >
          {formattedData}
        </Box>
      </Skeleton>
    </Stack>
  );
};
