import {
  Stack,
  Flex,
  Heading,
  Box,
  HStack,
  Grid,
  Text,
  Image,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Button,
} from "@chakra-ui/react";
import { ApeInfoBlue } from "../Icons/ApeInfoBlue";
import { USDC } from "../Icons/USDC";

export const Confirmation = () => {
  return (
    <Box
      border="1px solid rgba(230, 230, 230, 0.1)"
      bg="rgba(17, 69, 233, 0.35)"
      backdropFilter="auto"
      backdropBlur="3.75px"
      borderTopRadius={"12px"}
      width="100%"
      h={{ md: "495px", base: "400px" }}
      fontFamily={"Space Mono, monospace"}
      pos="absolute"
      ml={{ md: "-6", base: "-4" }}
      top="0"
      pt={{ md: "65px", base: "33px" }}
    >
      <Box top="6" right="6" pos="absolute">
        <svg
          width="29"
          height="29"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18"
            stroke="#F1F3F4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 6L18 18"
            stroke="#F1F3F4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Box>
      <Flex
        flexDir="column"
        justifyContent="center"
        align="center"
        gap="5"
        mx="4"
      >
        <Box w={{ md: "28", base: "16" }} h={{ md: "28", base: "16" }}>
          <ApeInfoBlue />
        </Box>
        <Text fontWeight="bold" fontSize="lg">
          Confirm Your Transaction
        </Text>
        <Stack
          bg="#2D3042"
          border="1px solid rgba(17, 69, 233, 0.5)"
          borderRadius="3px"
          py="3"
          px="4"
          maxW="md"
        >
          <Text px="4" textAlign="center">
            I want to offer a loan under the following terms:
          </Text>
          <Stack color="#9CA3AF" fontSize="sm">
            <Flex align="center" justifyContent="space-between">
              <Text>PRINCIPAL</Text>
              <Flex align="center" gap="2">
                <USDC />
                10.00
              </Flex>
            </Flex>
            <Flex align="center" justifyContent="space-between">
              <Text>PRINCIPAL</Text>
              <Flex align="center" gap="2">
                <USDC />
                10.00
              </Flex>
            </Flex>
            <Flex align="center" justifyContent="space-between">
              <Text>DURATION</Text>
              <Text>3 Days</Text>
            </Flex>
            <Flex align="center" justifyContent="space-between">
              <Text>APR</Text>
              <Flex align="center" gap="2">
                100.67%
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_131_7573)">
                    <path
                      d="M6.5 0C5.21442 0 3.95772 0.381218 2.8888 1.09545C1.81988 1.80968 0.986756 2.82484 0.494786 4.01256C0.00281636 5.20028 -0.125905 6.50721 0.124899 7.76809C0.375703 9.02896 0.994768 10.1872 1.90381 11.0962C2.81285 12.0052 3.97104 12.6243 5.23192 12.8751C6.49279 13.1259 7.79973 12.9972 8.98745 12.5052C10.1752 12.0132 11.1903 11.1801 11.9046 10.1112C12.6188 9.04229 13 7.78558 13 6.5C12.9981 4.77667 12.3127 3.12445 11.0941 1.90586C9.87556 0.687282 8.22334 0.00186392 6.5 0V0ZM6.5 11.9167C5.42869 11.9167 4.38143 11.599 3.49066 11.0038C2.5999 10.4086 1.90563 9.56264 1.49566 8.57287C1.08568 7.5831 0.978413 6.49399 1.18742 5.44326C1.39642 4.39253 1.91231 3.42737 2.66984 2.66984C3.42738 1.9123 4.39253 1.39642 5.44326 1.18741C6.49399 0.97841 7.58311 1.08568 8.57287 1.49565C9.56264 1.90563 10.4086 2.5999 11.0038 3.49066C11.599 4.38143 11.9167 5.42868 11.9167 6.5C11.9151 7.93611 11.3439 9.31294 10.3284 10.3284C9.31294 11.3439 7.93611 11.9151 6.5 11.9167Z"
                      fill="#9CA3AF"
                    />
                    <path
                      d="M6.50032 5.41699H5.95866C5.815 5.41699 5.67722 5.47406 5.57564 5.57564C5.47406 5.67722 5.41699 5.815 5.41699 5.95866C5.41699 6.10232 5.47406 6.24009 5.57564 6.34167C5.67722 6.44326 5.815 6.50033 5.95866 6.50033H6.50032V9.75033C6.50032 9.89398 6.55739 10.0318 6.65897 10.1333C6.76056 10.2349 6.89833 10.292 7.04199 10.292C7.18565 10.292 7.32342 10.2349 7.425 10.1333C7.52659 10.0318 7.58365 9.89398 7.58365 9.75033V6.50033C7.58365 6.21301 7.46952 5.93746 7.26635 5.73429C7.06319 5.53113 6.78764 5.41699 6.50032 5.41699Z"
                      fill="#9CA3AF"
                    />
                    <path
                      d="M6.5 4.33301C6.94873 4.33301 7.3125 3.96924 7.3125 3.52051C7.3125 3.07178 6.94873 2.70801 6.5 2.70801C6.05127 2.70801 5.6875 3.07178 5.6875 3.52051C5.6875 3.96924 6.05127 4.33301 6.5 4.33301Z"
                      fill="#9CA3AF"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_131_7573">
                      <rect width="13" height="13" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Flex>
            </Flex>
          </Stack>
        </Stack>
      </Flex>
    </Box>
  );
};
