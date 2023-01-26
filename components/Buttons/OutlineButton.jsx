import { Button } from "@chakra-ui/react";

export const OutlineButton = (props) => {
  const { buttonText, onClick, bgColor, ...rest } = props;
  return (
    <Button
      {...rest}
      onClick={onClick}
      borderRadius={"6px"}
      py="4"
      border="1px solid rgba(230, 230, 230, 0.1)"
      px="8"
      bgColor={bgColor ? bgColor : "rgba(18, 22, 33, 0.5)"}
      _hover={{
        backgroundColor: "rgba(230, 230, 230, 0.08)",
      }}
      _active={{
        backgroundColor: bgColor ? bgColor : "rgba(230, 230, 230, 0.08)",
      }}
    >
      {buttonText}
    </Button>
  );
};
