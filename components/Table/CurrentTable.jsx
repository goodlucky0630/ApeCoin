import { TableContainer, Stack, Table, Thead, Tbody, Tr, Th, Box } from "@chakra-ui/react";
import { TableRow } from "./TableRow";
import { formatAmount, timestampToDate } from "../../utils/formatters";

export const CurrentTable = ({ tableData }) => {
  return (
    <Stack>
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
              <Th textColor={"white"}>TRANSACTION HASH</Th>
              <Th textColor={"white"}>AMOUNT ($APE)</Th>
              <Th textColor={"white"}>ASSET TYPE</Th>
              <Th textColor={"white"}>TOKEN ID</Th>
              <Th textColor={"white"}>DATE</Th>
              <Th textColor={"white"}>PRICE OF $APE</Th>
            </Tr>
          </Thead>
          <Tbody fontFamily={"Space Mono, monospace"} letterSpacing={"1"}>
            {tableData?.map((transaction, idx) => {
              return (
                <TableRow
                  key={idx}
                  index={idx}
                  txHash={transaction.transactionHash}
                  amount={transaction.amount}
                  poolId={transaction.poolId}
                  tokenId={transaction.tokenId}
                  date={timestampToDate(transaction.timestamp)}
                  priceUSD={formatAmount(transaction.priceUSD, 2, true)}
                />
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Box fontSize={"xs"} textAlign="end">
        $APE price is 24/hr est
      </Box>
    </Stack>
  );
};
