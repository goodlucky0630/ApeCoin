import { Button } from "@chakra-ui/react";

export const RoundButton = (props) => {
  const { buttonText, onClick, ...rest } = props;
  return (
    <Button
      onClick={onClick}
      _hover={{ backgroundColor: "#ed007b" }}
      _active={{ backgroundColor: "#d4006e" }}
      backgroundColor="#FF0083"
      color={"white"}
      borderRadius="full"
      fontWeight={"bold"}
      size={{ base: "sm", md: "md" }}
      {...rest}
    >
      {buttonText}
    </Button>
  );
};
