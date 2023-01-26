import axios from "axios";
import { useState, useEffect } from 'react';
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
import { useAccount } from "wagmi";
import { useUserContext } from "../../contexts/User";
import { formatAmount } from "../../utils/formatters";
import { APECOIN, STAKING } from "../../constants/addresses";
import { ERC20_ABI } from "../../constants/abi";
const bigDecimal = require("js-big-decimal");

const baseURL = 'https://api.apecoinstaking.io/stats'

export const ApeStakingTopStatBar = (props) => {
  const { usersShare, ...rest } = props;
  const { address } = useAccount();
  const userContext = useUserContext();

  const [poolBayc, setPoolBayc] = useState(0);
  const [poolMayc, setPoolmayc] = useState(0);
  const [poolBakc, setPoolBakc] = useState(0);
  
  useEffect(() => {
    axios.get(`${baseURL}`)
      .then(response => {
        setPoolBayc(parseFloat(response.data[0].apybayc))
        setPoolmayc(parseFloat(response.data[0].apymayc))
        setPoolBakc(parseFloat(response.data[0].apybakc))
      })
  }, [])

  return (
    <Stack w="full" spacing="0" border="1px solid rgba(233, 233, 233, 0.3)" borderRadius="6px">
      <HStack spacing="0" flexDirection={{ base: "column", xl: "row" }}>
        <Stat
          title="BAYC Pool APY"
          formattedData={formatAmount(poolBayc, 2) + "%"}
          borderRight={{ base: "none", xl: "1px solid rgba(233, 233, 233, 0.3)" }}
          borderBottom={{ base: "1px solid rgba(233, 233, 233, 0.3)", xl: "none" }}
        />
        <Stat
          title="MAYC Pool APY"
          formattedData={formatAmount(poolMayc, 2) + "%"}
          borderRight={{ base: "none", xl: "1px solid rgba(233, 233, 233, 0.3)" }}
          borderBottom={{ base: "1px solid rgba(233, 233, 233, 0.3)", xl: "none" }}
        />
        <Stat
          title="BAKC Pool APY"
          formattedData={formatAmount(poolBakc, 2) + "%"}
          borderBottom={{ base: "1px solid rgba(233, 233, 233, 0.3)", xl: "none" }}
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
