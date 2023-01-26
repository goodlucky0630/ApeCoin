import { CardWrapper } from "../Card/CardWrapper";
import {
  Stack,
  Heading,
  HStack,
  Box,
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { useState } from "react";
import { useUserContext } from "../../contexts/User";
import Image from "next/image";
import { WalletContents } from "../Wallet/WalletContents";
import { RoundButton } from "../Buttons/RoundButton";
import { BAKC, BAYC, MAYC } from "../../constants/addresses";
import { ethers, utils } from "ethers";
import { errorToast, infoToast, successToast } from "../../pages/_app";
import { getEllipsisTxt } from "../../utils/formatters";
import axios from "axios";
import { CHAIN } from "../../constants/chain";
import { ASSET_VAULT_ABI } from "../../constants/abi";
import { useWalletOfOwner } from "../../hooks/useWalletOfOwner";

const contracts = {
  1: BAYC,
  2: MAYC,
  3: BAKC,
};

export function VaultContentsModal({ isOpen, onClose, vaultContents, vaultAddress, getVaults }) {
  const { address } = useAccount();
  const userContext = useUserContext();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const [isRemoving, setIsRemoving] = useState(false);
  const { data, isLoading, isError, getWalletOfOwner } = useWalletOfOwner(vaultAddress);

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

  const withdrawFromVaultERC721 = async () => {
    const vaultAddress = userContext.collateralState.vault;
    if (!utils.isAddress(vaultAddress)) {
      infoToast("Invalid Vault Address");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    try {
      setIsRemoving(true);
      const instance = new ethers.Contract(vaultAddress, ASSET_VAULT_ABI, signer);
      const tokenIds = userContext.collateralState.chosenTokens.map((i) => i.tokenId);
      const addresses = userContext.collateralState.chosenTokens.map((i) => i.address.toLowerCase());
      const withdraw = await instance.withdrawERC721(addresses[0], tokenIds[0], address);

      const result = await withdraw.wait();
      if (result.status === 1) {
        await axios.delete("/api/vault", {
          params: {
            contractAddress: addresses[0],
            tokenId: tokenIds[0],
          },
        });
        setIsRemoving(false);
        successToast("Successfully Removed From Vault!");
        await getVaults();
        await getVaults(true);
        await getWalletOfOwner();
        await userContext.getAllStakes();
        userContext.collateralDispatch({
          type: "RESET",
        });
      }
    } catch (error) {
      setIsRemoving(false);
      console.log(error);
      errorToast("An Error Occurred", "An error occurred removing withdraw.");
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size={"4xl"}>
      <ModalOverlay />
      <ModalContent>
        <Box bg="black">
          <CardWrapper maxW="6xl" minH="lg" mx="auto">
            <Stack gap="6" position={"relative"}>
              <ModalHeader position="relative" textAlign={"center"}>
                <Stack>
                  <Heading fontSize="3xl" fontFamily={"Space Mono, monospace"}>
                    Vault Contents
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
                      Select the NFTs you would like to remove from vault{" "}
                      <Link
                        isExternal
                        href={`https://${CHAIN === 5 ? "goerli." : ""}etherscan.io/address/${
                          userContext.collateralState.vault
                        }`}
                      >
                        {getEllipsisTxt(userContext.collateralState.vault)}.
                      </Link>{" "}
                      This will transfer the NFT from the vault into your wallet.
                    </Box>
                  </HStack>
                </Stack>
              </ModalHeader>
              <Stack align={"center"} pt={{ base: "16", lg: "10" }}>
                {address ? (
                  <WalletContents nftArray={data} isLoading={isLoading} handleSelect={handleSelect} />
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
                  buttonText="Remove Collateral"
                  onClick={withdrawFromVaultERC721}
                  isLoading={isRemoving}
                  loadingText="Removing From Vault"
                />
              </Flex>
            )}
          </CardWrapper>
        </Box>
      </ModalContent>
    </Modal>
  );
}
