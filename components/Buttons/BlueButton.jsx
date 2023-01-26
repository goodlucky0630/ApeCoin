import { Button } from "@chakra-ui/react";
import { forwardRef } from "react";

const BlueButton = forwardRef((props, ref) => {
  const { buttonText, onClick, isIcon, ...rest } = props;
  return (
    <Button
      ref={ref}
      bgColor="#FF0083"
      onClick={onClick}
      borderRadius={"6px"}
      py={isIcon ? "" : "4"}
      boxShadow={"0px 8px 24px rgba(255, 0, 131, 0.64)"}
      px={isIcon ? "" : "8"}
      _hover={{
        backgroundColor: "#ed007b",
      }}
      _active={{
        backgroundColor: "#d4006e",
      }}
      {...rest}
    >
      {buttonText}
    </Button>
  );
});

BlueButton.displayName = "BlueButton";

export default BlueButton;
