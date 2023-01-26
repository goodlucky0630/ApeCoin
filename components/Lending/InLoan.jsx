import { Flex, Box, Text, Image, Input, VStack } from "@chakra-ui/react";

import { calculateAPR, calculateDays } from "../../utils/createLoanTermsSignatureWithItems";
import { ethers } from "ethers";
import { formatAmount, timestampToDate } from "../../utils/formatters";

export const InLoan = ({ vault, offer, getOffers }) => {
  return (
    <VStack textAlign="left" gap={{ md: "10", base: "3" }}>
      <VStack align="stretch" width="100%" mt="4">
        <Text fontSize="sm" mb="3px">
          Principal
        </Text>
        <Flex
          width="100%"
          borderRadius="3px"
          alignItems="center"
          bgColor="rgba(228, 228, 228, 0.1)"
          border="1px solid #b0005a"
        >
          <Input
            fontSize="xl"
            bgColor="transparent"
            fontWeight="bold"
            width="100%"
            border="0px"
            focusBorderColor="none"
            name="principal"
            type="number"
            value={ethers.utils.formatEther(offer?.principal)}
            readOnly={true}
          />
          <Box h="55px" border="none" w="1px" bg="#b0005a" />
          <Image alt="" my="2" mx="4" width="40px" height="40px" src="/ape-coin.png" />
        </Flex>
      </VStack>
      <VStack align="stretch" width="100%" mt="4">
        <Text fontSize="sm" mb="3px">
          Repayment
        </Text>
        <Flex
          width="100%"
          borderRadius="3px"
          alignItems="center"
          bgColor="rgba(228, 228, 228, 0.1)"
          border="1px solid #b0005a"
        >
          <Input
            fontSize="xl"
            bgColor="transparent"
            fontWeight="bold"
            width="100%"
            border="0px"
            focusBorderColor="none"
            name="repayment"
            type="number"
            value={ethers.utils.formatEther(offer?.repayment)}
            readOnly={true}
          />
          <Box h="55px" border="none" w="1px" bg="#b0005a" />
          <Image alt="" my="2" mx="4" width="40px" height="40px" src="/ape-coin.png" />
        </Flex>
      </VStack>
      <Flex gap={{ md: "10", base: "4" }}>
        <VStack width="100%" align="stretch" mt="0">
          <Text fontSize="sm" mb="3px">
            Duration
          </Text>
          <Flex
            width="100%"
            borderRadius="3px"
            alignItems="center"
            bgColor="rgba(228, 228, 228, 0.1)"
            border="1px solid #b0005a"
          >
            <Input
              fontSize={{ md: "xl", base: "md" }}
              bgColor="transparent"
              fontWeight="bold"
              width="100%"
              border="0px"
              focusBorderColor="none"
              px={{ md: "4", base: "2" }}
              name="duration"
              type="number"
              value={calculateDays(offer?.duration)}
              readOnly={true}
            />
            <Box h="55px" border="none" w="1px" bg="#b0005a" />
            <Text fontSize={{ md: "xl", base: "base" }} fontWeight="bold" mx={{ md: "5", base: "2" }}>
              DAYS
            </Text>
            {/* <Box my="2" mx={{ md: "4", base: "2" }} w="35px" h="35px">
              <Clock />
            </Box> */}
          </Flex>
        </VStack>
        <VStack align="stretch" width="100%" mt="0">
          <Text fontSize="sm" mb="3px">
            Interest
          </Text>
          <Flex
            width="100%"
            borderRadius="3px"
            alignItems="center"
            bgColor="rgba(228, 228, 228, 0.1)"
            border="1px solid #b0005a"
          >
            <Input
              fontSize={{ md: "xl", base: "md" }}
              bgColor="transparent"
              fontWeight="bold"
              width="100%"
              border="0px"
              focusBorderColor="none"
              px={{ md: "4", base: "2" }}
              readOnly={true}
              value={calculateAPR({
                principal: offer?.principal,
                repayment: offer?.repayment,
                durationInDays: calculateDays(offer?.duration),
              })}
            />
            <Box h="55px" border="none" w="1px" bg="#b0005a" />
            <Text fontSize={{ md: "xl", base: "base" }} fontWeight="bold" mx={{ md: "5", base: "2" }}>
              APR
            </Text>
          </Flex>
        </VStack>
      </Flex>
      <Box>
        Loan Ends{" "}
        {new Date(Number(offer?.deadline) * 1000).toDateString() +
          " " +
          new Date(Number(offer?.deadline) * 1000).toLocaleTimeString()}
      </Box>
    </VStack>
  );
};
