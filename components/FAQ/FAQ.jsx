import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Center,
  TableContainer,
  Table,
  Tbody,
  Td,
  Tr,
  Text,
  Stack,
  UnorderedList,
  ListItem,
  Link,
} from "@chakra-ui/react";
import Image from "next/image";

export const FAQ = () => {
  return (
    <Accordion fontFamily={"Space Mono, monospace"} allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              WHAT IS APECOINSTAKING.IO?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Stack gap={"5"} mb={"5"}>
            <Text>
              Apecoinstaking.io is the official staking protocol for ApeCoin
              ($APE) established by the ApeCoin DAO (ApeDAO) and was created as
              a way for $APE, BAYC, MAYC, and BAKC holders to earn rewards
              through staking. $APE can be staked by itself or in conjunction
              with a BAYC, MAYC, or BAKC in one of the four staking pools, with
              each pool offering different levels of rewards.
            </Text>

            <Text>
              The ApecoinStaking.io protocol was proposed in AIPs 21 and 22 and
              subsequently approved by the community on May 4, 2022. Following
              approval, the Ape Foundation enlisted Horizen Labs to provide a
              platform for the staking protocol according to the specifications
              set forth in the AIPs.
            </Text>

            <Text>
              To help clarify terminology, the AIPs provided definitions for
              some important terms:
            </Text>
          </Stack>

          <Stack ml={"5"}>
            <Text>
              <Text as="b">Staking Pools:</Text> The total ApeCoin pools that
              participants can earn from.
            </Text>

            <Text>
              <Text as="b">Staking Pool Type:</Text> The pool is specifically
              assigned to a digital asset class; there are four in total.
            </Text>

            <Text>
              <Text as="b">Staking Period:</Text> Each period is 12 months.
            </Text>

            <Text>
              <Text as="b">Staking Pool Allocations:</Text> The total amount of
              ApeCoin allocated to each Staking Pool Type per period.
            </Text>

            <Text>
              <Text as="b">Total Staking Period:</Text> A total of three (3)
              years.
            </Text>

            <Text>
              <Text as="b">Initial Staking Period:</Text> The first 12-month
              period of staking.
            </Text>

            <Text>
              <Text as="b">Pool Distribution:</Text> The spread of the staking
              allocation assigned across the period.
            </Text>

            <Text>
              <Text as="b">Incentive Distribution Curve:</Text> The schedule of
              ApeCoin allocated for incentives per quarter.
            </Text>
          </Stack>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              WHAT BROWSERS AND DEVICES SUPPORT APECOINSTAKING.IO?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          Any desktop browser that contains Metamask or WalletConnect
          integration will allow you to stake $APE. For mobile devices, only the
          browser in Metamask&apos;s iOS or Android application will support
          staking $APE.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              HOW DOES APE STAKING WORK?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Stack gap={5} mb={5}>
            <Text>
              ApecoinStaking.io allows holders of $APE to put their idle tokens
              to work by staking them within various pools and earning
              additional rewards in the form of more $APE.
            </Text>

            <Text>
              ApecoinStaking.io is more than just a simple staking protocol. It
              has the distinction of offering layers of rewards for holders of
              certain NFTs. Operating like a safe-deposit box key, these NFTs
              grant holders access to exclusive staking pools.
            </Text>

            <Text>
              Below is a breakdown of the four staking pools and their total
              allocations as specified in AIP 22 for Year 1:
            </Text>
          </Stack>

          <UnorderedList>
            <ListItem>$APE Staking Pool: 30,000,000 $APE Tokens</ListItem>

            <ListItem>BAYC Staking Pool: 47,105,000 $APE Tokens</ListItem>

            <ListItem>MAYC Staking Pool: 19,060,000 $APE Tokens</ListItem>

            <ListItem>BAKC Staking Pool: 3,835,000 $APE Tokens</ListItem>
          </UnorderedList>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              WHY DO I HAVE TO GIVE THE SMART CONTRACT APPROVAL TO SPEND $APE ON
              MY BEHALF?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Stack gap={5}>
            <Text>
              When a user deposits ApeCoin, the staking smart contract must
              transfer tokens out of the user&apos;s wallet and into the
              contract itself. This action cannot be taken unless the user
              grants specific permission.
            </Text>

            <Text>
              This action will modify the state of the ApeCoin ERC-20 contract,
              which is why it will incur a small gas fee. See{" "}
              <Link
                isExternal
                href={
                  "https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20-allowance-address-address-"
                }
                style={{ textDecoration: "underline" }}
              >
                here
              </Link>{" "}
              for more details about ERC-20 allowance
            </Text>
          </Stack>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              WHAT HAPPENS WHEN I SELL MY NFT WHILE IT IS COMMITTED?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Text color={"rgb(245 20 20)"} as={"b"}>
            WE STRONGLY RECOMMEND THAT YOU UNCOMMIT YOUR BAYC, MAYC, OR BAKC
            PRIOR TO THE SALE.
          </Text>

          <Box my={10}>
            <Text mx={5} as={"b"}>
              If I sell my NFT while it is committed in a BAYC or MAYC pool,
              will I lose all of my staked $APE?
            </Text>
          </Box>

          <Text>
            <Text as="b" color={"rgb(245 20 20)"}>
              YES, YOU WILL LOSE YOUR STAKED $APE.
            </Text>{" "}
            Think of your BAYC or MAYC like a box that holds your $APE. If you
            sell the box, the new owner gets the box plus all of its contents.
            So, if you&apos;re about to sell your BAYC or MAYC,{" "}
            <Text as="b" color={"rgb(245 20 20)"}>
              WE STRONGLY RECOMMEND THAT YOU UNCOMMIT YOUR NFT PRIOR TO THE
              SALE.
            </Text>{" "}
            This will ensure a clean deposit into your wallet of both your
            staked and earned rewards. If you happen to sell your NFT and forget
            to uncommit it, the new owner has the ability to uncommit it, and as
            the NFT is transferred to the new owner, so too will transfer your
            staked $APE and rewards.
          </Text>

          <Box my={10}>
            <Text mx={5} as={"b"}>
              If I sell my NFT while it is committed in a Paired pool, will I
              lose all of my staked $APE?
            </Text>
          </Box>

          <Stack gap={5}>
            <Text>
              Similarly, new owners will have rights to the staked position,
              with a few caveats.{" "}
              <Text as="b" color={"rgb(245 20 20)"}>
                WE STRONGLY RECOMMEND THAT YOU UNCOMMIT YOUR NFTS PRIOR TO THE
                SALE.
              </Text>
            </Text>

            <Text>
              For the Paired Pool, the owner of the BAYC or MAYC is entitled to
              the staked amount, whereas the owner of the BAKC is entitled to
              any unclaimed rewards associated with the staking position.
            </Text>
          </Stack>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              WHY IS APECOINSTAKING.IO NOT AVAILABLE IN THE UNITED STATES OR
              CANADA? WHICH OTHER COUNTRIES ARE GEOBLOCKED?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Stack gap={5}>
            <Text>
              Due to the current regulatory uncertainty surrounding reward
              pools, ApecoinStaking.io is not available within the United States
              or Canada. We&apos;re actively tracking new legislation and
              regulatory guidance as it&apos;s released, and as soon as we can
              make ApecoinStaking.io available to U.S. and Canadian residents in
              a legally compliant way, we will do so.
            </Text>

            <Text>
              Other countries where ApecoinStaking.io is unavailable include:
            </Text>

            <UnorderedList pl={5}>
              <ListItem>North Korea</ListItem>
              <ListItem>Syria</ListItem>
              <ListItem>Iran</ListItem>
              <ListItem>Cuba</ListItem>
              <ListItem>Russia</ListItem>
              <ListItem>in Ukraine: Donetsk, Luhansk, and Crimea</ListItem>
            </UnorderedList>
          </Stack>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              WHAT IS APECOIN ($APE)?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Stack gap={5} mb={5}>
            <Text>
              ApeCoin (trading symbol: $APE) is the official token of the
              ApeCoin DAO (ApeDAO) and was created as a way to expand the Bored
              Ape Community by offering new avenues of participation beyond
              simply buying, owning, and trading BAYC, MAYC, or BAKC NFTs.
              Holders of $APE may issue and vote on proposals designed to
              improve the value and utility of the Ape ecosystem.
            </Text>

            <Text>
              Without getting too technical, $APE is an ERC-20 governance and
              utility token of the Ape ecosystem. The ApeCoin{" "}
              <Link
                isExternal
                href="https://apecoin.com/"
                style={{ textDecoration: "underline" }}
              >
                website
              </Link>{" "}
              sums up the DAO&apos;s responsibility like this:
            </Text>
          </Stack>

          <Box mx={5}>
            <Text as="i">
              The ApeCoin community governs itself via the ApeCoin DAO, the
              decentralized governance framework that supports the Ecosystem
              Fund. The DAO follows a proposal process to vote on how the
              Ecosystem Fund will be distributed by the APE Foundation to
              promote a diverse and self-sustaining ecosystem.
            </Text>
          </Box>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              HOW MUCH CAN I EARN BY STAKING MY $APE?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Stack gap={5} mb={5}>
            <Text>
              Plenty. AIP 22 was specific in detailing the pace at which the
              different staking pools distribute rewards, though the rate varies
              depending on how much $APE is staked at any given time across the
              four pools. Also worth noting, ApeDAO reserves the right to change
              the staking allocation at any time. The table below illustrates
              this:
            </Text>

            <Text>
              Without getting too technical, $APE is an ERC-20 governance and
              utility token of the Ape ecosystem. The ApeCoin{" "}
              <Link
                isExternal
                href="https://apecoin.com/"
                style={{ textDecoration: "underline" }}
              >
                website
              </Link>{" "}
              sums up the DAO&apos;s responsibility like this:
            </Text>
          </Stack>

          <Center my={"10px"}>
            <Image
              src={"/images/pools-allocations.png"}
              alt="ApeCoin"
              width={"450"}
              height={"100"}
            />
          </Center>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              WHAT ARE BORED APE YACHT CLUB NFTS?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Stack gap={5}>
            <Box>
              <Text as="b">Bored Ape Yacht Club</Text>

              <Text>
                Launched in April 2021 by Yuga Labs, the{" "}
                <Link
                  isExternal
                  href="https://www.gemini.com/cryptopedia/what-is-bored-ape-yacht-club-nft-bored-apes"
                  style={{ textDecoration: "underline" }}
                >
                  Bored Ape Yacht Club
                </Link>{" "}
                (BAYC) is a collection of 10,000 NFTs. These unique digital
                collectibles live on the Ethereum blockchain and represent the
                most successful NFT collection in history, with sales of
                individual NFTs reaching $2.3 million dollars at auction. The
                collection gave rise to a thriving community of Ape NFT
                enthusiasts.
              </Text>
            </Box>

            <Box>
              <Text as="b">Bored Ape Kennel Club</Text>

              <Text>
                Shortly after the launch of the BAYC collection, Yuga Labs
                launched the{" "}
                <Link
                  isExternal
                  href="https://www.gemini.com/cryptopedia/101-bored-ape-kennel-club-bakc-nft-bayc-nft"
                  style={{ textDecoration: "underline" }}
                >
                  Bored Ape Kennel Club
                </Link>{" "}
                in June 2021, an NFT collection of 9,602 unique dogs, which were
                not available for sale but rather only offered to those who held
                a Bored Ape NFT in a wallet. The collection was intended to
                serve as companions to the original Bored Apes.
              </Text>
            </Box>

            <Box>
              <Text as="b">Mutant Ape Yacht Club</Text>

              <Text>
                In August 2022, Yuga Labs launched its third NFT collection, the{" "}
                <Link
                  isExternal
                  href="https://www.gemini.com/cryptopedia/what-is-mutant-ape-yacht-club-nft-bayc-mayc-crypto#section-what-is-mutant-ape-yacht-club"
                  style={{ textDecoration: "underline" }}
                >
                  Mutant Ape Yacht Club
                </Link>{" "}
                (MAYC) a popular offshoot of BAYC and BAKC. 20,000 MAYCs were
                issued with half being auctioned off while the other half were
                allocated to the holders of Bored Apes.
              </Text>
            </Box>

            <Text>
              All three NFT collections leverage the widespread ERC-721 token
              standard employed by the Ethereum blockchain. And just in case
              you&apos;re new to this crypto stuff, NFTs are unique digital
              tokens that can be used to prove ownership of an asset or item.
              This can include a work of digital art, a document, or a digital
              title.
            </Text>
          </Stack>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              DO I NEED TO OWN AN APE, MUTANT, OR DOG TO STAKE $APE?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          No. Any $APE holder can stake their $APE and accumulate rewards. In
          fact, all staking on the ApecoinStaking.io site consists of staking
          actual $APE. It&apos;s only the presence of an NFT in a wallet that
          provides holders with access into different staking pools and reward
          levels.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              HOW IS THE STAKING VALUE CALCULATED?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Stack spacing={5}>
            <Text>
              Here&apos;s what AIP 22 has to say about the fluctuating value of
              staked assets:
            </Text>

            <Box px={"10"}>
              <Text as={"i"}>
                The Staking Pool Allocations for Staking Periods following the
                Initial Staking Period will be determined by the market prices
                of the BAYC, MAYC, and BAKC NFTs. An average price during Q4 of
                the previous Staking Period will determine the ratio allocated
                to each of the Staking Pool types. The $APE Staking Pool will
                remain constant at 30%. Note: The BAKC Staking pool can only be
                utilized if a BAKC NFT is being paired 1:1 with a BAYC or MAYC
                NFT.
              </Text>
            </Box>

            <Text>
              As an example, the chart below provides a visual representation of
              the staking values for Year 1:
            </Text>
          </Stack>
          <Center my={10}>
            <Image
              src={"/images/pools-allocations-breakdown.png"}
              alt="ApeCoin"
              width={"450"}
              height={"100"}
            />
          </Center>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              WHAT ARE THE RISKS OF STAKING WITH APECOINSTAKING.IO?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Stack spacing={5} mb={5}>
            <Text>
              All staking protocols come with some measure of risk and none are
              100% secure.
            </Text>

            <Text>
              To help mitigate these risks, Horizen Labs has gone to great
              lengths to protect your staked tokens with measures that include:
            </Text>

            <Box px={5}>
              <Text as="i">
                Smart Contract Audit: The smart contract developed by Horizen
                Labs has been audited by the security firm Halborn and the audit
                report can be found{" "}
                <Link
                  isExternal
                  href="https://docs.apestake.io/_media/Horizen_Labs_Grapes_Staking_Smart_Contract_Security_Audit_Report_Halborn_Final_Update.pdf"
                  style={{ textDecoration: "underline" }}
                >
                  here
                </Link>
                .
              </Text>
            </Box>

            <Text>
              Again, in spite of these measures, risks of staking on
              ApecoinStaking.io exist. These risks could include but are not
              limited to events like:
            </Text>

            <Text as="b">Forfeiture of Tokens</Text>

            <Text>
              When you stake tokens, they technically move outside of your
              control and become part of the block forging rewards mechanism.
              While security measures have been implemented, there remains a
              non-zero risk that staked tokens may be vulnerable to hacks or
              undiscovered bugs, which could lead to a total loss of your
              tokens.
            </Text>

            <Text as="b">Smart Contract Vulnerabilities</Text>

            <Text>
              Code is written by humans, so naturally there is an ever-present
              risk that ApecoinStaking.io could contain a smart contract
              vulnerability or bug. ApecoinStaking.io&apos;s code is
              open-sourced and audited by{" "}
              <Link
                isExternal
                href="https://halborn.com/"
                style={{ textDecoration: "underline" }}
              >
                Halborn
              </Link>
              , crypto&apos;s leading security auditing company.
            </Text>

            <Text as="b">NFT Transfers of Ownership</Text>

            <Text>
              See FAQ question: “What happens when I sell my NFT while it is
              committed?”
            </Text>
          </Stack>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              WHAT FEES ARE ASSOCIATED WITH STAKING $APE ON APECOINSTAKING.IO?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          The only fees that apply are normal transaction gas fees on the
          Ethereum network.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              WHICH PROPOSALS BROUGHT APECOINSTAKING.IO INTO EXISTENCE?
            </Box>
            <AccordionIcon color={"#FF0083"} />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          APE Improvement Proposals (AIPs) number{" "}
          <Link
            isExternal
            href="https://forum.apecoin.com/t/aip-21-staking-process-with-caps-1x-drop-process/5074"
            style={{ textDecoration: "underline" }}
          >
            21
          </Link>{" "}
          and{" "}
          <Link
            isExternal
            href="https://forum.apecoin.com/t/aip-22-staking-pool-allocation-reloaded-ecosystem-fund-allocation/5071"
            style={{ textDecoration: "underline" }}
          >
            22
          </Link>{" "}
          were submitted by giacolmo.eth and approved by the Ape Community on
          May 4, 2022. Here are some additional details from the AIP:
          <TableContainer mt={5}>
            <Table variant="simple">
              <Tbody
                fontFamily={"Space Mono, monospace"}
                letterSpacing={"1"}
                border={"1px solid gray"}
              >
                <Tr>
                  <Td>Community Forum</Td>
                  <Td>
                    <Box>
                      <Text>
                        The ApeCoin community governs itself via the ApeCoin
                        DAO, the decentralized governance framework that
                      </Text>
                      <Text>
                        supports the Ecosystem Fund. The DAO follows a proposal
                        process to vote on how the Ecosystem Fund
                      </Text>  
                        
                      <Text>
                        will be distributed by the APE Foundation to promote a diverse
                        and self-sustaining ecosystem.
                      </Text>
                    </Box>
                  </Td>
                </Tr>

                <Tr>
                  <Td>AIP 21</Td>
                  <Td>
                    <Text>
                      This AIP proposes a staking system for ApeCoin and the
                      Bored Ape Yacht Club (BAYC) NFT ecosystem. 
                    </Text>
                    <Text>
                      See{" "}
                      <Link
                        isExternal
                        href="https://forum.apecoin.com/t/aip-21-staking-process-with-caps-1x-drop-process/5074"
                        style={{ textDecoration: "underline" }}
                        >
                        {" "}
                        full proposal
                      </Link>
                      for AIP 21.
                    </Text>
                  </Td>
                </Tr>

                <Tr>
                  <Td>AIP 22</Td>
                  <Td>
                    <Text>
                      This proposal presents the total ApeCoin allocation for
                      the staking pools and the three-year duration 
                    </Text>

                    <Text>
                      of this
                      staking period. See{" "}
                      <Link
                        href="https://forum.apecoin.com/t/aip-22-staking-pool-allocation-reloaded-ecosystem-fund-allocation/5071"
                        isExternal
                        style={{ textDecoration: "underline" }}
                        >
                        {" "}
                        full proposal
                      </Link>
                      for AIP 21.
                    </Text>  
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
