import Link from "next/link";
import { CardWrapper } from "../Card/CardWrapper";
import { LendingCard } from "../Lending/LendingCard";
import {
  Stack,
  HStack,
  Box,
  Flex,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";
import BlueButton from "../Buttons/BlueButton";
import { Open } from "../Icons/Open";
import { BsTrash } from "react-icons/bs";
import { Add } from "../Icons/Add";
import { getEllipsisTxt } from "../../utils/formatters";
import { useUserContext } from "../../contexts/User";
import { useRouter } from "next/router";
import WalletModal from "../Modals/WalletModal";
import { ethers, utils } from "ethers";
import { ASSET_VAULT_ABI } from "../../constants/abi";
import { useState } from "react";
import { infoToast, successToast, errorToast } from "../../pages/_app";
import { useSigner, useNetwork, useAccount } from "wagmi";
import { useRef } from "react";
import { BAYC, MAYC, BAKC } from "../../constants/addresses";
import { VaultContentsModal } from "../../components/Modals/VaultContentsModal";
import { CHAIN } from "../../constants/chain";

const poolIds = {
  [BAYC.toLowerCase()]: "1",
  [MAYC.toLowerCase()]: "2",
  [BAKC.toLowerCase()]: "3",
};

export const VaultCard = (props) => {
  const { vault, getVaults, isMyVaults, ...rest } = props;
  const { address } = useAccount();
  const userContext = useUserContext();
  const { data: signer } = useSigner();
  const router = useRouter();
  const { chain } = useNetwork();

  const { isOpen: isWalletOpen, onOpen: onVaultOpen, onClose: onWalletClose } = useDisclosure();
  const { isOpen: isOpenVault, onOpen: onOpenVault, onClose: onCloseVault } = useDisclosure();
  const [isEnabling, setIsEnabling] = useState(false);
  const initialFocusRef = useRef();

  const chooseVaultToEdit = () => {
    userContext.collateralDispatch({
      type: "HANDLE_CHOOSE_VAULT",
      payload: vault.vault,
    });
  };

  const openModal = () => {
    onVaultOpen();
    chooseVaultToEdit();
  };

  const openWithdrawModal = () => {
    onOpenVault();
    chooseVaultToEdit();
  };

  const enableWithdraw = async () => {
    if (!utils.isAddress(vault.vault)) {
      infoToast("Invalid Vault Address");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    try {
      setIsEnabling(true);
      const instance = new ethers.Contract(vault.vault, ASSET_VAULT_ABI, signer);
      const deposit = await instance.enableWithdraw();
      const result = await deposit.wait();
      if (result.status === 1) {
        await getVaults();
        await getVaults(true);
        setIsEnabling(false);
        successToast("Successfully Enabled Withdraw!");
      }
    } catch (error) {
      setIsEnabling(false);
      console.log(error);
      errorToast("An Error Occurred", "An error occurred enabling withdraw.");
    }
  };

  const vaultContents = vault?.inventory?.map((i) => ({
    id: i.id,
    poolId: poolIds[i.contract],
    contract: i.contract,
    tokenId: i.tokenId,
  }));

  return (
    <CardWrapper h="fit-content" {...rest}>
      <Stack>
        <LendingCard vault={vault} />
        <HStack spacing="0" gap="2" justifyContent={isMyVaults ? "space-between" : "end"} w="full">
          {isMyVaults && (
            <Box fontWeight={"bold"}>
              Vault <br /> {getEllipsisTxt(vault.vault, 2)}
            </Box>
          )}

          {vault?.owner.toLowerCase() === address?.toLowerCase() && (
            <Flex gap="3" justifyContent={"center"} flexWrap={"wrap"}>
              <Box>
                {!vault?.isWithdrawEnabled && ( //also if not in loan
                  <Popover
                    closeOnBlur={!isEnabling}
                    isLazy
                    initialFocusRef={initialFocusRef}
                    placement="bottom"
                  >
                    <PopoverTrigger>
                      <BlueButton buttonText="Remove" />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody bgColor="rgba(18, 22, 33, 0.5)">
                        <Stack>
                          <Box>
                            Unlocking vault will disable deposits, loans cannot be given, and you can withdraw
                            collateral.
                          </Box>
                          <BlueButton
                            isDisabled={isEnabling}
                            isLoading={isEnabling}
                            loadingText="Unlocking"
                            buttonText="Unlock Vault"
                            onClick={enableWithdraw}
                          />
                        </Stack>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}
              </Box>
              {!vault?.isWithdrawEnabled ? (
                <BlueButton onClick={openModal} buttonText={<Add />} isIcon={true} isDisabled={isEnabling} />
              ) : (
                <BlueButton
                  buttonText={<BsTrash fontSize={"20px"} />}
                  isIcon={true}
                  onClick={openWithdrawModal}
                />
              )}

              {isMyVaults && (
                <Link href={`/vault/${vault.vault}`}>
                  <BlueButton isDisabled={isEnabling} buttonText="Open" leftIcon={<Open />} />
                </Link>
              )}
            </Flex>
          )}
        </HStack>
      </Stack>
      {isWalletOpen && (
        <WalletModal getVaults={getVaults} isOpen={isWalletOpen} onClose={onWalletClose} />
        //add isWithdrawing prop so can withdraw tokens
      )}
      {isOpenVault && (
        <VaultContentsModal
          getVaults={getVaults}
          vaultAddress={vault?.vault}
          isOpen={isOpenVault}
          onClose={onCloseVault}
          vaultContents={vaultContents}
        />
        //add isWithdrawing prop so can withdraw tokens
      )}
    </CardWrapper>
  );
};
