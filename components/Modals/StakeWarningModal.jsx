import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Stack,
} from "@chakra-ui/react";
import BlueButton from "../Buttons/BlueButton";
import { ApeInfoBlue } from "../Icons/ApeInfoBlue";

export const StakeWarningModal = ({ onClose, isOpen, text }) => {
  return (
    <Modal
      blockScrollOnMount={false}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <ModalOverlay
        bg="linear-gradient(81.21deg, rgba(254, 172, 94, 0.2) 0%, rgba(199, 121, 208, 0.2) 52.41%, rgba(75, 192, 200, 0.2) 104.81%)"
        backdropFilter="blur(7.5px)"
      />
      <ModalContent borderRadius={"2xl"} bg="#242731" color="white">
        <ModalHeader
          borderRadius={"1rem 1rem 0 0"}
          bg="#242731"
          fontSize={"2xl"}
          p="6"
          textAlign={"center"}
        >
          Hold Up!
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          minH={{ base: "", md: "200px" }}
          textAlign={"center"}
          bg="#242731"
        >
          <Stack spacing="4">
            <Box width="5rem" mx="auto">
              <ApeInfoBlue />
            </Box>
            <Box fontSize={"xl"} fontWeight="500">
              {text
                ? text
                : "Please be sure to delist your NFT or revoke any permissions of marketplaces so your NFT isn&apos;t sold with staked ApeCoin."}
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter bg="#242731" borderRadius={"0 0 1rem 1rem"}>
          <BlueButton w="full" buttonText="I Understand" onClick={onClose} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
