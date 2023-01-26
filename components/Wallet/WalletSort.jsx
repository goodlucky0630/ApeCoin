import { Button, ButtonGroup } from "@chakra-ui/react";

export const WalletSort = (props) => {
  const { isDisabled, sortType, handleSort, ...rest } = props;

  return (
    <ButtonGroup
      {...rest}
      w="fit-content"
      fontFamily={"Space Mono, monospace"}
      spacing="0"
      borderRadius={"full"}
      bg="rgba(228, 228, 228, 0.1)"
    >
      <SortButton
        buttonText="All"
        isDisabled={isDisabled}
        onClick={() => handleSort(0)}
        isActive={sortType === 0}
      />
      <SortButton
        buttonText="BAYC"
        isDisabled={isDisabled}
        onClick={() => handleSort(1)}
        isActive={sortType === 1}
      />
      <SortButton
        buttonText="MAYC"
        isDisabled={isDisabled}
        onClick={() => handleSort(2)}
        isActive={sortType === 2}
      />
      <SortButton
        buttonText="BAKC"
        isDisabled={isDisabled}
        onClick={() => handleSort(3)}
        isActive={sortType === 3}
      />
    </ButtonGroup>
  );
};

const SortButton = (props) => {
  const { buttonText, isActive, onClick, ...rest } = props;
  return (
    <Button
      {...rest}
      bg={isActive ? "#FF0083" : "transparent"}
      px="4"
      onClick={onClick}
      borderRadius={"full"}
      fontWeight="600"
      py="0"
      size="xs"
      _hover={{
        backgroundColor: "#ed007b",
      }}
      _active={{
        backgroundColor: "#d4006e",
      }}
    >
      {buttonText}
    </Button>
  );
};
