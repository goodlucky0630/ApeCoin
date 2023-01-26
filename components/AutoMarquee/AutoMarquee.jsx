import Marquee from "react-fast-marquee";
import Link from "next/link";
import { Text, Flex } from "@chakra-ui/react";

export const AutoMarquee = () => {
  return (
    <Link href="/auto-compound">
      <Marquee
        gradient={false}
        pauseOnHover={true}
        speed={30}
        style={{
          backgroundColor: "rgba(255, 0, 131, 0.35)",
          border: "1px solid rgba(233, 233, 233, 0.5)",
          cursor: "pointer",
          padding: ".4em 0",
        }}
      >
        <Flex gap="4" px="2">
          <Flex gap="1">
            <Text fontWeight={"bold"}>Click Here</Text>
            <Text>to Access the New Auto-Compounder!</Text>
          </Flex>
          <Flex gap="1">
            <Text fontWeight={"bold"}>Click Here</Text>
            <Text>to Access the New Auto-Compounder!</Text>
          </Flex>
          <Flex gap="1">
            <Text fontWeight={"bold"}>Click Here</Text>
            <Text>to Access the New Auto-Compounder!</Text>
          </Flex>
          <Flex gap="1">
            <Text fontWeight={"bold"}>Click Here</Text>
            <Text>to Access the New Auto-Compounder!</Text>
          </Flex>
        </Flex>
      </Marquee>
    </Link>
  );
};
