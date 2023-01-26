import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
} from "@chakra-ui/react";
// import { useDepositTxns } from "../../hooks/useDepositTxns";
import { LoansRow } from "./LoansRow";
export const Loan = () => {

  const Loans = [
    {
        NFT: '/images/Example-1.svg',
        Collection: 1,
        Principal: "35.00",
        APR: '42%',
        Due: 'Dec 22',
        LendonAsset: 'Offer',
        Status: 'Repaid'
    },
    {
        NFT: '/images/Example-2.svg',
        Collection: 2,
        Principal: "35.00",
        APR: '42%',
        Due: 'Dec 22',
        LendonAsset: 'Lend',
        Status: 'Repaid'
    },
    {
        NFT: '/images/Example-3.svg',
        Collection: 3,
        Principal: "35.00",
        APR: '42%',
        Due: 'Dec 22',
        LendonAsset: 'Offer',
        Status: 'Defaulted'
    },
    {
        NFT: '/images/Example-4.svg',
        Collection: 4,
        Principal: "35.00",
        APR: '42%',
        Due: 'Dec 22',
        LendonAsset: 'Lend',
        Status: 'Defaulted'
    },
  ]

  return (

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
            <Tr
              bg={"rgb(17, 69, 233, 0.5)"}
              fontFamily={"Space Mono, monospace"}
              letterSpacing={"1"}
            >
              <Th textColor={"white"}>NFT</Th>
              <Th textColor={"white"}>COLLECTION</Th>
              <Th textColor={"white"}>PRINCIPAL</Th>
              <Th textColor={"white"}>APR</Th>
              <Th textColor={"white"}>DUE</Th>
              <Th textColor={"white"}>LEND ON ASSET</Th>
            </Tr>
          </Thead>
          <Tbody fontFamily={"Space Mono, monospace"} letterSpacing={"1"}>
            {Loans?.map((Loan, idx) => {
              return (
                <LoansRow
                key={idx}
                index={idx}
                NFT={Loan.NFT}
                Collection={Loan.Collection}
                Principal={Loan.Principal}
                APR={Loan.APR}
                Due={Loan.Due}
                LendonAsset={Loan.LendonAsset}
                Status={Loan.Status}
                />
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
  );
};
