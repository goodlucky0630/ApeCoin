import { Button, Stack, Box } from "@chakra-ui/react";

export const ApeStakingButtonBox = (props) => {
  const {
    title,
    data,
    buttonText,
    hasButtonBorder,
    shouldChangeBtnColor,
    shouldChangeStatColor,
    changeColor,
    isLoading,
    loadingText,
    onClick,
    ...rest
  } = props;

  return (
    <Stack
      border="1px solid rgba(233, 233, 233, 0.3)"
      borderRadius={"6px"}
      spacing="0"
      {...rest}
      fontFamily={"Space Mono, monospace"}
      align="center"
      minW={{ base: "100%", md: "50%" }}
    >
      <Box pt="6" textAlign={"center"}>
        {title}
      </Box>
      <Box
        color={shouldChangeStatColor && changeColor && "#1E54FF"}
        textShadow={shouldChangeStatColor && changeColor && "0px 0px 7px rgba(17, 69, 233, 0.8)"}
        pt="3"
        pb="8"
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="700"
      >
        {data}
      </Box>
      <Button
        borderTop={hasButtonBorder ? "1px solid rgba(233, 233, 233, 0.3)" : ""}
        borderRadius={"0 0 6px 6px"}
        onClick={onClick}
        w="full"
        isLoading={isLoading}
        loadingText={loadingText}
        py="8"
        fontWeight={"600"}
        fontSize="lg"
        boxShadow={shouldChangeBtnColor && changeColor && "0px 8px 24px rgba(255, 0, 131, 0.64)"}
        backgroundColor={shouldChangeBtnColor && changeColor ? "#FF0083" : "rgba(228, 228, 228, 0.1)"}
        _hover={{
          backgroundColor: shouldChangeBtnColor && changeColor ? "#ed007b" : "rgba(228, 228, 228, 0.15)",
        }}
        _active={{
          backgroundColor: shouldChangeBtnColor && changeColor ? "#d4006e" : "rgba(228, 228, 228, 0.07)",
        }}
      >
        {buttonText}
      </Button>
    </Stack>
  );
};
