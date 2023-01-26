import { Button } from "@chakra-ui/react";

export const ChartButton = (props) => {
  const { title, isSelected, onClick, ...rest } = props;
  return (
    <Button
      {...rest}
      bg={isSelected ? "#FF0083" : "transparent"}
      onClick={onClick}
      fontWeight="700"
      borderRadius={"full"}
      color="white"
      size="xs"
      p="3"
      _hover={{ bg: "" }}
      _active={{ bg: "" }}
      variant={"ghost"}
    >
      {title}
    </Button>
  );
};
