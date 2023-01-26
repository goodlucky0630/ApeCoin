import { TableContainer, Table, Thead, Tbody, Tr, Th, Flex, Text, Spinner, Box } from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { LendRow } from "./LendRow";
import { useVaults } from "../../hooks/useVaults";

export const Lend = () => {
  const { data, isLoading } = useVaults();
  return (
    <>
      {!data && isLoading ? (
        <Flex justifyContent={"center"} py="10">
          <Spinner size="lg" color="#FF0083" />
        </Flex>
      ) : data?.filter((i) => i.inventory.length > 0).length === 0 ? (
        <Flex justifyContent={"center"} py="10">
          <Box>No Valid Vaults Found</Box>
        </Flex>
      ) : (
        <TableContainer
          maxH="lg"
          overflowY={"auto"}
          sx={{
            "&::-webkit-scrollbar": {
              width: "2px",
              height: "2px",
              borderRadius: "2px",
              backgroundColor: `rgba(0, 0, 0, 0.05)`,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: `white`,
              borderRadius: "8px",
            },
          }}
        >
          <Table variant="simple">
            <Thead>
              <Tr bg={"rgb(17, 69, 233, 0.5)"} fontFamily={"Space Mono, monospace"} letterSpacing={"1"}>
                <Th textColor={"white"}>NFT</Th>
                <Th textColor={"white"}>VALUATION</Th>
                <Th textColor={"white"}>
                  <Text>FLOOR</Text>
                </Th>
                <Th textColor={"white"}>COLLECTION</Th>
                <Th textColor={"white"}>LEND ON ASSET</Th>
              </Tr>
            </Thead>
            <Tbody fontFamily={"Space Mono, monospace"} letterSpacing={"1"}>
              {data
                ?.filter((i) => i.inventory.length > 0)
                .map((vault, idx) => {
                  return (
                    <LendRow
                      key={idx}
                      index={idx}
                      inventory={vault.inventory}
                      vaultId={vault.vault}
                      vaultTokenId={vault.vaultTokenId}
                    />
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};
