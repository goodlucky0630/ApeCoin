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

export const Success = () => {
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
        textAlign="center"
      >
        <Box w={{ md: "28", base: "16" }} h={{ md: "28", base: "16" }}>
          <ApeInfoBlue />
        </Box>
        <Text fontWeight="bold" fontSize="lg">
          Your Transaction Was Successful!
        </Text>
        <Flex
          gap="5"
          mt={{ md: "8", base: "0" }}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Box
            bg="#2D3042"
            fontWeight="bold"
            px="7"
            py="3"
            borderRadius="3px"
            border="1px solid rgba(230, 230, 230, 0.1)"
          >
            Close
          </Box>
          <Flex
            bg="#34A2F2"
            fontWeight="bold"
            px="7"
            py="3"
            borderRadius="3px"
            align="center"
            gap="2"
          >
            <svg
              width="20"
              height="17"
              viewBox="0 0 20 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 2.29875C19.2563 2.625 18.4637 2.84125 17.6375 2.94625C18.4875 2.43875 19.1363 1.64125 19.4412 0.68C18.6488 1.1525 17.7738 1.48625 16.8412 1.6725C16.0887 0.87125 15.0162 0.375 13.8462 0.375C11.5763 0.375 9.74875 2.2175 9.74875 4.47625C9.74875 4.80125 9.77625 5.11375 9.84375 5.41125C6.435 5.245 3.41875 3.61125 1.3925 1.1225C1.03875 1.73625 0.83125 2.43875 0.83125 3.195C0.83125 4.615 1.5625 5.87375 2.6525 6.6025C1.99375 6.59 1.3475 6.39875 0.8 6.0975C0.8 6.11 0.8 6.12625 0.8 6.1425C0.8 8.135 2.22125 9.79 4.085 10.1712C3.75125 10.2625 3.3875 10.3062 3.01 10.3062C2.7475 10.3062 2.4825 10.2913 2.23375 10.2362C2.765 11.86 4.2725 13.0538 6.065 13.0925C4.67 14.1838 2.89875 14.8412 0.98125 14.8412C0.645 14.8412 0.3225 14.8263 0 14.785C1.81625 15.9563 3.96875 16.625 6.29 16.625C13.835 16.625 17.96 10.375 17.96 4.9575C17.96 4.77625 17.9538 4.60125 17.945 4.4275C18.7588 3.85 19.4425 3.12875 20 2.29875Z"
                fill="white"
              />
            </svg>
            Share
          </Flex>
          <Box
            bg="#1145E9"
            fontWeight="bold"
            px="7"
            py="3"
            borderRadius="3px"
            _hover={{
              filter: "drop-shadow(0px 8px 24px rgba(17, 69, 233, 0.64))",
            }}
            transitionDuration="200ms"
            cursor="pointer"
          >
            Manage
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};
