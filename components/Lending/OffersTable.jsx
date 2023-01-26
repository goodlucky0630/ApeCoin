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
import { utils, ethers } from "ethers";
import { useState, useMemo, useEffect, useRef } from "react";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { CHAIN } from "../../constants/chain";
import { formatAmount, getEllipsisTxt, timestampToDate } from "../../utils/formatters";
import { ApeCoinLogo } from "../Icons/ApeCoinLogo";
import { infoToast, successToast, errorToast } from "../../pages/_app";
import { APECOIN, ITEMS_VERIFIER, VAULT_FACTORY, ORIGINATION_CONTROLLER } from "../../constants/addresses";
import { encodeSignatureItems } from "../../utils/createLoanTermsSignatureWithItems";
import { fromRpcSig } from "ethereumjs-util";
import { ORIGINATION_CONTROLLER_ABI, VAULT_FACTORY_ABI } from "../../constants/abi";
import axios from "axios";

export const OffersTable = ({ vault, offers, offersIsLoading, getOffers, getBorrowNotes }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const [isAccepting, setIsAccepting] = useState(false);
  const controllerInstance = useMemo(
    () => new ethers.Contract(ORIGINATION_CONTROLLER, ORIGINATION_CONTROLLER_ABI, signer),
    [signer]
  );
  const vaultFactoryInstance = useMemo(
    () => new ethers.Contract(VAULT_FACTORY, VAULT_FACTORY_ABI, signer),
    [signer]
  );

  const [isOCApproved, setIsOCApproved] = useState(undefined);
  const [isApproving, setIsApproving] = useState(false);
  const chosenRef = useRef(null);

  const getIsApproved = async () => {
    try {
      const operator = await vaultFactoryInstance.getApproved(vault?.vaultTokenId);
      if (operator.toLowerCase() === ORIGINATION_CONTROLLER.toLowerCase()) {
        setIsOCApproved(true);
        return true;
      } else {
        setIsOCApproved(false);
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (vaultFactoryInstance.provider !== null && isOCApproved === undefined && vault) {
      getIsApproved();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultFactoryInstance, isOCApproved, vault]);

  const startLoanAsBorrower = async (offerToAccept) => {
    if (!address) {
      infoToast("No Wallet Found", "Please connect a wallet.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet.");
      return;
    }
    try {
      chosenRef.current = offerToAccept.signature;
      setIsAccepting(true);
      const loanTerms = {
        durationSecs: Number(offerToAccept.duration),
        principal: offerToAccept.principal.toString(),
        interestRate: offerToAccept.interestRate.toString(),
        collateralAddress: VAULT_FACTORY.toLowerCase(),
        collateralId: offerToAccept.vaultTokenId,
        payableCurrency: APECOIN.toLowerCase(),
        numInstallments: Number(offerToAccept.numOfInstallments),
        deadline: Number(offerToAccept.deadline),
      };

      let signatureItems = [];
      for (let i = 0; i < vault.inventory.length; i++) {
        signatureItems.push({
          cType: 0,
          asset: vault.inventory[i].contract,
          tokenId: vault.inventory[i].tokenId,
          amount: 0,
        });
      }

      const predicates = [
        {
          verifier: ITEMS_VERIFIER,
          data: encodeSignatureItems(signatureItems),
        },
      ];
      const isApproved = await getIsApproved();

      if (!isApproved) {
        const approve = await approveOC();
        if (!approve) {
          return;
        }
      }

      const initLoan = await controllerInstance.initializeLoanWithItems(
        loanTerms,
        address.toLowerCase(),
        offerToAccept.signersAddress.toLowerCase(),
        fromRpcSig(offerToAccept.signature),
        Number(offerToAccept.nonce),
        predicates
      );

      const result = await initLoan.wait();
      if (result.status === 1) {
        await axios.put("/api/offers", {
          offerId: offerToAccept.id,
          status: "ACCEPTED",
          lendersAddress: offerToAccept.signersAddress,
          sender: address,
        });
        await getOffers();
        setIsAccepting(false);
        successToast("Successfully Started Loan", "Loan has been initialized!");
        await getBorrowNotes();
      }
    } catch (error) {
      console.log(error);
      errorToast("An Error Occurred", "An error occurred accepting terms.");
      setIsAccepting(false);
    }
  };

  const approveOC = async () => {
    if (!address) {
      infoToast("No Wallet Found", "Please connect a wallet.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet.");
      return;
    }
    try {
      setIsApproving(true);

      const approve = await vaultFactoryInstance.approve(ORIGINATION_CONTROLLER, vault.vaultTokenId);
      const result = await approve.wait();
      if (result.status === 1) {
        setIsApproving(false);
        successToast("Successfully Granted Approval");
        return true;
      }
    } catch (error) {
      setIsApproving(false);
      errorToast("An Error Occurred", "An error occurred granting approval.");
      console.log(error);
      return false;
    }
  };
  return (
    <Box
      backgroundColor="rgba(18, 22, 33, 0.5)"
      border="1px solid rgba(230, 230, 230, 0.1)"
      borderRadius={"12px"}
      py=""
      width="100%"
      fontFamily={"Space Mono, monospace"}
      mt="10"
    >
      <Text fontSize="xl" textAlign={{ md: "left", base: "center" }} fontWeight="bold" py="6" px="6">
        Offers
      </Text>
      <Box>
        <TableContainer>
          <Table colorScheme="white">
            <Thead>
              <Tr
                backgroundColor="rgba(17, 69, 233, 0.25)"
                h="20"
                borderTop="2px"
                borderBottom="2px"
                borderColor="rgba(230, 230, 230, 0.4)"
              >
                <Th color="#ffffff" fontFamily={"Space Mono, monospace"}>
                  Principal
                </Th>
                <Th color="#ffffff" fontFamily={"Space Mono, monospace"}>
                  Repayment
                </Th>
                <Th color="#ffffff" fontFamily={"Space Mono, monospace"}>
                  Duration
                </Th>

                <Th color="#ffffff" fontFamily={"Space Mono, monospace"}>
                  Interest
                </Th>

                <Th color="#ffffff" fontFamily={"Space Mono, monospace"}>
                  Signer
                </Th>
                <Th color="#ffffff" fontFamily={"Space Mono, monospace"}>
                  Type
                </Th>
                <Th color="#ffffff" fontFamily={"Space Mono, monospace"}>
                  Expire
                </Th>

                <Th color="#ffffff" position="sticky" right="-3" w="100px"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {offers &&
                !offersIsLoading &&
                offers?.length > 0 &&
                offers.map((i, idx) => (
                  <Tr pos="relative" key={idx}>
                    <Td>
                      <Flex gap="2">
                        {utils.formatEther(i?.principal)} <ApeCoinLogo width="20px" />
                      </Flex>
                    </Td>
                    <Td>
                      <Flex gap="2">
                        {utils.formatEther(i?.repayment)} <ApeCoinLogo width="20px" />
                      </Flex>
                    </Td>
                    <Td>
                      {Number(i?.duration) / 86400} {Number(i?.duration) > 86400 ? "days" : "day"}{" "}
                    </Td>
                    <Td>
                      {formatAmount(
                        utils.formatEther(i.interestRate.slice(0, i?.interestRate.length - 2)),
                        2
                      )}
                      %
                    </Td>

                    <Td>{getEllipsisTxt(i?.signersAddress)}</Td>
                    <Td>VAULT</Td>
                    <Td>{timestampToDate(i?.deadline)}</Td>
                    <Td position="sticky" right="-3" w="100px">
                      {address?.toLowerCase() === i.owner?.toLowerCase() &&
                        address?.toLowerCase() !== i.signersAddress?.toLowerCase() && (
                          <Button
                            h={{ md: "14", base: "12" }}
                            px={{ md: "6", base: "4" }}
                            bg="#2D3042"
                            fontSize={{ md: "base", base: "xs" }}
                            color="#ffffff"
                            _hover={{
                              color: "#ffffff",
                              bg: "#FF0083",
                              boxShadow: "0px 8px 24px rgba(255, 0, 131, 0.64)",
                            }}
                            onClick={async () => startLoanAsBorrower(i)}
                            isDisabled={isAccepting || isApproving}
                            isLoading={chosenRef.current === i.signature && isAccepting}
                            loadingText="Accepting"
                          >
                            Accept
                          </Button>
                        )}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
        {offers?.length === 0 && !offersIsLoading && (
          <Box textAlign={"center"} py="8">
            No Valid Offers
          </Box>
        )}
      </Box>
    </Box>
  );
};
