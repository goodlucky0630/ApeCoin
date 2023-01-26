import { ConnectKitButton } from "connectkit";
import { Button } from "@chakra-ui/react";
import { getEllipsisTxt } from "../../utils/formatters";

export const Connect = (props) => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, address, show }) => {
        return (
          <Button
            onClick={show}
            _hover={{ backgroundColor: "#ed007b" }}
            _active={{ backgroundColor: "#d4006e" }}
            backgroundColor="#FF0083"
            color={"white"}
            {...props}
            borderRadius="full"
            fontWeight={"bold"}
            size={{ base: "sm", md: "md" }}
          >
            {isConnected ? getEllipsisTxt(address) : "Connect Wallet"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
