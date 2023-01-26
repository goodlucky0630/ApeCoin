import { CardWrapper } from "../Card/CardWrapper";
import {
  Stack,
  Heading,
  HStack,
  Box,
  Flex,
  useDisclosure,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useAccount, useSigner, useNetwork } from "wagmi";
import { useState, useMemo } from "react";
import { useUserContext } from "../../contexts/User";
import Image from "next/image";
import { WalletContents } from "../Wallet/WalletContents";
import { WalletSort } from "../Wallet/WalletSort";
import { RoundButton } from "../Buttons/RoundButton";
import { CgFolderAdd } from "react-icons/cg";
import { BAKC, BAYC, DEPOSIT_ROUTER, MAYC } from "../../constants/addresses";
import { DEPOSIT_ROUTER_ABI, ERC721_ABI } from "../../constants/abi";
import { StakeWarningModal } from "../Modals/StakeWarningModal";
import { ethers, utils } from "ethers";
import { errorToast, infoToast, successToast } from "../../pages/_app";
import { getEllipsisTxt } from "../../utils/formatters";
import axios from "axios";
import { CHAIN } from "../../constants/chain";
import { useWalletOfOwner } from "../../hooks/useWalletOfOwner";

const contracts = {
  1: BAYC,
  2: MAYC,
  3: BAKC,
};

export default function WalletModal({ isOpen, onClose, getVaults }) {
  const { address } = useAccount();
  const userContext = useUserContext();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [sortType, setSortType] = useState(0);
  const { data: signer } = useSigner();
  const [isDepositing, setIsDepositing] = useState(false);
  const { chain } = useNetwork();
  const { data, isLoading, isError, getWalletOfOwner } = useWalletOfOwner(address);

  const nftArray =
    data?.length > 0 &&
    data
      .filter((i) => i?.poolId !== "0")
      .filter((i) => (sortType === 0 ? i : Number(i?.poolId) === sortType));

  const handleSort = (type) => {
    setSortType(type);
  };

  const handleSelect = (poolId, tokenId) => {
    userContext.collateralDispatch({
      type: "HANDLE_CHOOSE_TOKEN",
      payload: [
        {
          poolId: poolId,
          tokenId: tokenId,
          address: contracts[poolId],
        },
      ],
    });
  };

  const addToVault = async () => {
    const vault = userContext.collateralState.vault;
    if (!utils.isAddress(vault)) {
      infoToast("Invalid Vault Address");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (!userContext.isSignedIn) {
      infoToast("Please Sign In", "Sign message in wallet to sign in to continue");
      return;
    }
    try {
      setIsDepositing(true);
      const tokenIds = userContext.collateralState.chosenTokens.map((i) => i.tokenId);
      const addresses = userContext.collateralState.chosenTokens.map((i) => i.address);

      const instance = new ethers.Contract(addresses[0], ERC721_ABI, signer);
      const deposit = await instance.safeTransferFrom(address, vault, tokenIds[0]);
      const result = await deposit.wait();
      if (result.status === 1) {
        await axios.post("/api/vault", {
          vault: vault.toLowerCase(),
          contractAddress: addresses[0].toLowerCase(),
          tokenId: tokenIds[0],
        });
        await userContext.getAllStakes();
        await getVaults();
        await getVaults(true);

        successToast("Successful Deposit!");
        userContext.collateralDispatch({
          type: "RESET",
        });
        setIsDepositing(false);
      }
    } catch (error) {
      setIsDepositing(false);
      console.log(error);
      errorToast("An Error Occurred", "An error occurred depositing into vault.");
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size={"4xl"}>
      <ModalOverlay />
      <ModalContent>
        <Box bg={"black"} borderRadius="md">
          <CardWrapper maxW="6xl" minH="lg" mx="auto">
            <Stack gap="6" position={"relative"}>
              <ModalHeader position="relative" textAlign={"center"}>
                <Stack>
                  <Heading fontSize="3xl" fontFamily={"Space Mono, monospace"}>
                    Your Wallet
                  </Heading>
                  <HStack
                    justifyContent={"space-between"}
                    position="absolute"
                    left="0"
                    gap="2"
                    spacing="0"
                    top={{ base: "62", sm: "62", md: "62", lg: "62" }}
                    w="full"
                    flexDir={{ base: "column", md: "row" }}
                  >
                    <Box
                      as="p"
                      textAlign={isMobile ? "center" : ""}
                      fontSize={"sm"}
                      // maxW="300px"
                    >
                      Select the NFTs you would like to add to vault{" "}
                      <Link
                        isExternal
                        href={`https://${CHAIN === 5 ? "goerli." : ""}etherscan.io/address/${
                          userContext.collateralState.vault
                        }`}
                      >
                        {getEllipsisTxt(userContext.collateralState.vault)}.
                      </Link>{" "}
                      This will transfer the NFT from you wallet into the vault contract.
                    </Box>
                    <WalletSort sortType={sortType} handleSort={handleSort} />
                  </HStack>
                </Stack>
              </ModalHeader>
              <Stack align={"center"} pt={{ base: "16", lg: "10" }}>
                {address ? (
                  <WalletContents nftArray={nftArray} isLoading={isLoading} handleSelect={handleSelect} />
                ) : (
                  <Box animation={"fadeIn .75s"}>
                    <Image
                      loading="eager"
                      src="/images/spinning-coin.gif"
                      width="300"
                      height="250"
                      priority
                      alt=""
                    />
                    <Box textAlign={"center"} fontFamily={"Space Mono, monospace"}>
                      Connect Wallet To View
                    </Box>
                  </Box>
                )}
              </Stack>
            </Stack>
            {userContext.collateralState.chosenTokens.length !== 0 && (
              <Flex animation={"fadeIn .75s"} justifyContent={"center"} position="relative" bottom="5">
                <RoundButton
                  buttonText="Add Collateral"
                  leftIcon={isDepositing ? null : <CgFolderAdd fontSize={"24px"} />}
                  onClick={addToVault}
                  isLoading={isDepositing}
                  loadingText="Adding To Vault"
                />
              </Flex>
            )}
          </CardWrapper>
        </Box>
      </ModalContent>
    </Modal>
  );
}
