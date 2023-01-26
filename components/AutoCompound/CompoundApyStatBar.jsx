import axios from "axios";
import { useEffect, useState } from "react";
import { 
  Stack, 
  Box, 
  Flex, 
  Skeleton,
  HStack,
  Tooltip
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { formatAmount } from "../../utils/formatters";
import { useUserContext } from "../../contexts/User";

const baseURL = 'https://api.apecoinstaking.io/stats'

export const CompoundApyStatBar = (props) => {
  const { usersShare, ...rest } = props;
  const userContext = useUserContext();

  const [apy, setApy] = useState(0);
  const [apyMinus, setApyMinus] = useState(0)
  const [poolApy, setPoolApy] = useState(0);
  const [totalStake, setTotalStake] = useState(0);

  useEffect(() => {
    axios.get(`${baseURL}`)
      .then(response => {
        setApyMinus(parseFloat(response.data[0].apy_minus_1))
        setApy(parseFloat(response.data[0].apy))
        setPoolApy(parseFloat(response.data[0].apyape))
        setTotalStake(parseFloat(response.data[0].total_stake))
      })
  }, [])

  return (
    <Stack w="full" spacing="0" border="1px solid rgba(233, 233, 233, 0.3)" borderRadius="6px">
      <HStack spacing="0" flexDirection={{ base: "column", md: "row" }}>
        <Stat
          title="Total $APE Staked"
          formattedData={
            userContext?.allPools ?
              formatAmount(ethers.utils.formatEther(userContext?.allPools[0].stakedAmount)) : "0"
          }
          isTooltip={true}
          toolTipText="This value represents the total amount staked in the $ape only pool."
          borderRight={{ md: "1px solid rgba(233, 233, 233, 0.3)" }}
        />
        <Stat
          title="$APE staked"
          isTooltip={true}
          toolTipText="Total amount of apecoin staked in the auto-compounder"
          formattedData={formatAmount(totalStake, 2)}
        />
      </HStack>
      <HStack 
        borderTop={"1px solid rgba(233, 233, 233, 0.3)"}
        spacing="0"
        flexDirection={{ base: "column", md: "row" }}
        >
        <Stat
          title="$APE only pool APY"
          isTooltip={true}
          formattedData={formatAmount(poolApy, 2) + "%"}
          toolTipText="APY of '$APE only pool' without any auto-compounding effect"
          borderRight={{ md: "1px solid rgba(233, 233, 233, 0.3)" }}
        />
        <Stat
          title="Compounded APY (gross)"
          formattedData={formatAmount(apy, 2) + "%"}
          isTooltip={true}
          toolTipText="This is the auto-compounded APY for the $ape only pool. The rewards are auto-harvested and re-staked every 24 hr."
          borderRight={{ md: "1px solid rgba(233, 233, 233, 0.3)" }}
        />
        <Stat
          title="Compounded APY (net)"
          isTooltip={true}
          toolTipText="This is the auto-compounded APY for the $ape only pool with platform fee deduction. The auto-compounder takes 1% of the rewards claimed each harvesting period."
          formattedData={formatAmount(apyMinus, 2) + "%"}
        />
      </HStack>
    </Stack>
  );
};

const Stat = (props) => {
  const { title, formattedData, willChangeColor, toolTipText, isTooltip, changeColor, ...rest } = props;
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
      <HStack fontSize={"sm"} color="#808191">
        <Box textAlign={"center"}>{title}</Box>
        {isTooltip && <Tooltip label={toolTipText} placement="top" hasArrow>
          <InfoOutlineIcon />
        </Tooltip>}
      </HStack>
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

