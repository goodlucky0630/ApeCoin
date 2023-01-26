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

export const HistoryModal = () => {
  return (
    <Box
      border="1px solid rgba(230, 230, 230, 0.1)"
      bg="rgba(17, 69, 233, 0.53)"
      borderRadius={"12px"}
      width="100%"
      fontFamily={"Space Mono, monospace"}
    >
      <Box>
        <TableContainer px="6" pb="6" pt="3">
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th
                  color="#ffffff"
                  fontSize={{ md: "lg", base: "base" }}
                  px="0"
                  border="0px"
                  pb="6"
                  fontFamily={"Space Mono, monospace"}
                >
                  History
                </Th>
                <Th
                  color="#ffffff"
                  fontSize={{ md: "lg", base: "base" }}
                  px="0"
                  border="0px"
                  pb="6"
                  isNumeric
                  fontFamily={"Space Mono, monospace"}
                >
                  0xb66...7a28e
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr pos="relative">
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  LOANS BORROWED
                </Td>
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  isNumeric
                >
                  11
                </Td>
              </Tr>
              <Tr pos="relative">
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  LOANS REPAID
                </Td>
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  isNumeric
                >
                  11
                </Td>
              </Tr>
              <Tr pos="relative">
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  LOANS DEFAULTED
                </Td>
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  isNumeric
                >
                  11
                </Td>
              </Tr>
              <Tr pos="relative">
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  TOTAL INTEREST
                </Td>
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  isNumeric
                >
                  11
                </Td>
              </Tr>
              <Tr pos="relative">
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  INTEREST PAID
                </Td>
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  isNumeric
                >
                  11
                </Td>
              </Tr>
              <Tr pos="relative">
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  TOTAL BORROWED
                </Td>
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  isNumeric
                >
                  11
                </Td>
              </Tr>
              <Tr pos="relative">
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  TOTAL REPAID
                </Td>
                <Td
                  px="0"
                  pb="1"
                  borderColor="rgba(230, 230, 230, 0.3)"
                  isNumeric
                >
                  11
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
