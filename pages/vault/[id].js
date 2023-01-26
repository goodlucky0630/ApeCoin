import { useRouter } from "next/router";

import { Box, Stack, Grid, Heading, HStack, Flex, Skeleton, Spinner } from "@chakra-ui/react";
import { CardWrapper } from "../../components/Card/CardWrapper";
import { DoubleLeftChevron } from "../../components/Icons/DoubleLeftChevron";
import { DesiredTerms } from "../../components/Lending/DesiredTerms";
import { useVaults } from "../../hooks/useVaults";
import { Borrow } from "../../components/Lending/Borrow";
import { OffersTable } from "../../components/Lending/OffersTable";
import { MakeOffer } from "../../components/Lending/MakeOffer";
import { NFTChart } from "../../components/Charts/NFTChart";
import { useUserContext } from "../../contexts/User";
import { VaultCard } from "../../components/Vault/VaultCard";
import { useAccount } from "wagmi";
import { useOffers } from "../../hooks/useOffers";
import { LoanInformation } from "../../components/Lending/LoanInformation";
import { ManageStake } from "../../components/Lending/ManageStake";
import { useBorrowNotes } from "../../hooks/useBorrowNotes";
import { InLoan } from "../../components/Lending/InLoan";
import { useLenderNotes } from "../../hooks/useLenderNotes";

export default function Vault() {
  const router = useRouter();
  const userContext = useUserContext();
  //if vault does not exist -> show deosn't exist page
  //desired terms for first time creation and owner
  //if has lender -> show make payment and manage stake
  //if just viewing show toggle desired terms/make offer
  //-if not terms- > show open to terms
  //-if potential lender allow sign offer to be clickable
  const { data, isLoading, getVaults } = useVaults();
  const { data: borrowNotes, isLoading: isLoadingBorrowNotes, getBorrowNotes } = useBorrowNotes();
  const {
    data: lenderNotes,
    // isLoading: isLoadingBorrowNotes,
    getLenderNotes,
  } = useLenderNotes();
  const { data: offers, isLoading: offersIsLoading, getOffers } = useOffers(router?.query?.id?.toLowerCase());

  const { address } = useAccount();
  const vault = data?.filter((i) => i.vault.toLowerCase() === router?.query?.id?.toLowerCase())[0];
  const acceptedOffer = offers?.filter((i) => i.status === "ACCEPTED")[0];
  const desiredOffer = offers?.filter((i) => i.status === "DESIRED")[0];

  const compToShow = () => {
    if (data === undefined || offersIsLoading) {
      return (
        <Flex justifyContent={"center"} pt="40%">
          <Spinner size="lg" color="#FF0083" />
        </Flex>
      );
    }
    if (vault?.isWithdrawEnabled) {
      if (
        (vault?.inventory?.length > 0 || Number(vault?.apeCoinBalance) > 0) &&
        vault?.owner?.toLowerCase() === address?.toLowerCase()
      ) {
        return (
          <Stack spacing="6">
            <Flex justifyContent={"center"} textAlign="center" h="full" align={"center"}>
              Withdraw Enabled. <br /> Offers can no longer be given or loans initiated.
            </Flex>
            <ManageStake vault={vault} getVaults={getVaults} />
          </Stack>
        );
      }
      return (
        <Flex justifyContent={"center"} textAlign="center" h="full" align={"center"}>
          Withdraw Enabled. <br /> Offers can no longer be given or loans initiated.
        </Flex>
      );
    }
    if (acceptedOffer && acceptedOffer?.lendersAddress?.toLowerCase() === address?.toLowerCase()) {
      return (
        <LoanInformation
          offer={acceptedOffer}
          loanId={lenderNotes?.filter((i) => i.vaultTokenId === acceptedOffer.vaultTokenId)[0]?.loanId}
          getOffers={getOffers}
          allOffers={offers}
          vaultOwner={vault?.owner}
          getVaults={getVaults}
        />
      );
    }
    if (acceptedOffer && acceptedOffer?.owner === address?.toLowerCase()) {
      if (vault?.inventory?.length > 0) {
        return (
          <Stack spacing="6">
            <DesiredTerms
              offer={acceptedOffer}
              allOffers={offers}
              getOffers={getOffers}
              vault={vault}
              loanId={borrowNotes?.filter((i) => i.vaultTokenId === acceptedOffer.vaultTokenId)[0]?.loanId}
              getBorrowNotes={getBorrowNotes}
            />

            <ManageStake vault={vault} getVaults={getVaults} />
          </Stack>
        );
      }
      return (
        <DesiredTerms
          offer={acceptedOffer}
          allOffers={offers}
          getOffers={getOffers}
          vault={vault}
          loanId={borrowNotes?.filter((i) => i.vaultTokenId === acceptedOffer.vaultTokenId)[0]?.loanId}
          getBorrowNotes={getBorrowNotes}
        />
      );
    }
    if (
      acceptedOffer &&
      ((acceptedOffer?.lendersAddress?.toLowerCase() !== address?.toLowerCase() &&
        acceptedOffer?.owner !== address?.toLowerCase()) ||
        !address)
    ) {
      return <InLoan offer={acceptedOffer} offers={offers} getOffers={getOffers} />;
    }
    if (
      address?.toLowerCase() === vault?.owner?.toLowerCase() &&
      offers?.filter((i) => i.signersAddress === address?.toLowerCase()).length === 0
    ) {
      if (vault?.inventory?.length > 0) {
        return (
          <Stack spacing="6">
            <MakeOffer vault={vault} offers={offers} getOffers={getOffers} />
            <ManageStake vault={vault} getVaults={getVaults} />
          </Stack>
        );
      }
      return <MakeOffer vault={vault} offers={offers} getOffers={getOffers} />;
    }
    if (
      (vault?.inventory?.length > 0 || Number(vault?.apeCoinBalance) > 0) &&
      vault?.owner?.toLowerCase() === address?.toLowerCase()
    ) {
      return (
        <Stack spacing="6">
          {!desiredOffer ? (
            <MakeOffer vault={vault} offers={offers} getOffers={getOffers} />
          ) : (
            <DesiredTerms
              offer={desiredOffer}
              allOffers={offers}
              getOffers={getOffers}
              vault={vault}
              getBorrowNotes={getBorrowNotes}
            />
          )}
          <ManageStake vault={vault} getVaults={getVaults} />
        </Stack>
      );
    }
    return (
      <Borrow
        desiredOffer={desiredOffer}
        getBorrowNotes={getBorrowNotes}
        vault={vault}
        offers={offers}
        getOffers={getOffers}
        loanId={borrowNotes?.filter((i) => i.vaultTokenId === acceptedOffer?.vaultTokenId)[0]?.loanId}
      />
    );
  };

  return (
    <Stack px={{ base: "2", md: "8" }} maxW="8xl" mx="auto" pt="16" pb="36" pos="relative">
      <CardWrapper>
        <Grid
          borderBottom={"1px solid rgba(230, 230, 230, 0)"}
          mx="-23px"
          pb={{ md: "3", base: "6" }}
          templateColumns="repeat(3, 1fr)"
          mb={{ md: "12px", base: "0" }}
        >
          <Box ml="6" w="fit-content" onClick={() => router.back()}>
            <DoubleLeftChevron cursor="pointer" />
          </Box>
          <Box position="relative" textAlign={"center"}>
            <HStack justifyContent="center" mt="-4">
              <Heading fontSize="3xl" fontFamily={"Space Mono, monospace"}>
                Vault
                <Box mt={{ md: "-48px", base: "-52px" }}>
                  <svg
                    width="199"
                    height="67"
                    viewBox="0 0 199 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L28.5 43H174L198 1"
                      stroke="#E6E6E6"
                      strokeOpacity="0.2"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
              </Heading>
            </HStack>
          </Box>
        </Grid>
        <Box>
          <Flex
            flexDirection={{ md: "row", base: "column" }}
            pt={{ md: "6", base: "2" }}
            gap={{ lg: "8", base: "6" }}
          >
            <Flex flexDirection={"column"} w={{ lg: "40%", md: "30%", base: "100%" }} gap="6">
              <Skeleton isLoaded={!isLoading}>
                <VaultCard vault={vault} getVaults={getVaults} isMyVaults={false} />
              </Skeleton>
              <Box>
                <CardWrapper>
                  <NFTChart height={125} chartData={userContext?.historicalFloor} />
                </CardWrapper>
              </Box>
            </Flex>
            <CardWrapper>{compToShow()}</CardWrapper>
          </Flex>
          {offers?.filter((i) => i.status === "ACCEPTED").length === 0 && (
            <OffersTable
              vault={vault}
              offers={offers?.filter((i) => i.status === "DESIRED" || i.status === "LENDER")}
              offersIsLoading={offersIsLoading}
              getOffers={getOffers}
              getBorrowNotes={getBorrowNotes}
            />
          )}
        </Box>
      </CardWrapper>
    </Stack>
  );
}
