import {
  HStack,
  Slider as ChakraSlider,
  Button,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
} from "@chakra-ui/react";

export const Slider = (props) => {
  const { onChange, value, max, maxAmount, ...rest } = props;
  return (
    <HStack {...rest}>
      <ChakraSlider
        onChange={(val) => onChange(val)}
        value={value}
        min={0}
        max={max}
      >
        <SliderTrack
          h="25px"
          borderRadius={"full"}
          border="2px solid #FBFCFD"
          bg="#FBFCFD"
        >
          <SliderFilledTrack borderRadius={"full"} bg="#FF0083" />
        </SliderTrack>
        <SliderThumb boxSize={6}>
          <Box
            boxShadow={"md"}
            borderRadius={"full"}
            h="10px"
            w="10px"
            bg="#FF0083"
          />
        </SliderThumb>
      </ChakraSlider>
      <Button
        borderRadius={"full"}
        size="sm"
        onClick={maxAmount}
        bgColor="#FF0083"
        _hover={{
          backgroundColor: "#ed007b",
        }}
        _active={{
          backgroundColor: "#d4006e",
        }}
      >
        MAX
      </Button>
    </HStack>
  );
};
