import "../styles/globals.css";
import "focus-visible/dist/focus-visible";

import { ChakraProvider } from "@chakra-ui/react";
import { Layout } from "../components/Layout/Layout";
import { WagmiConfig, createClient, configureChains, chain } from "wagmi";
import { createStandaloneToast } from "@chakra-ui/toast";
import { ConnectKitProvider } from "connectkit";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { IFrameEthereumConnector } from "@ledgerhq/ledger-live-wagmi-connector";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { NextSeo } from "next-seo";
import { ThemeWrapper } from "../contexts/Theme";
import TagManager from "react-gtm-module";
import { useEffect } from "react";
import Script from "next/script";
import { UserWrapper } from "../contexts/User";
const { toast } = createStandaloneToast();

const { chains, provider } = configureChains(
  [chain.goerli],
  [
    jsonRpcProvider({
      rpc: () => {
        return { http: process.env.NEXT_PUBLIC_RPC_URL };
      },
    }),
  ]
);

const client = createClient({
  autoConnect: false,
  connectors: [
    new IFrameEthereumConnector({ chains, options: {} }),

    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "ape-staking-test",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
});

const tagManagerArgs = {
  gtmId: "GTM-PH7HX5F",
};

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-PH7HX5F');
      `}
      </Script>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-4TPCSD8P21"
      ></Script>
      <Script id="google-tag">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-4TPCSD8P21');
      `}
      </Script>
      <NextSeo
        title="ApeCoin Staking"
        titleTemplate="ApeCoin Staking"
        defaultTitle="ApeCoin Staking"
        description="ApeCoin Staking Interface"
        canonical="https://apecoinstaking.io/"
        openGraph={{
          url: "https://apecoinstaking.io/",
          title: "ApeCoin Staking",
          description: "ApeCoin Staking Interface",
          images: [
            {
              url: "https://apecoinstaking.io/ape-coin.png",
              width: 600,
              height: 600,
              alt: "ApeCoin Staking",
            },
          ],
        }}
      />
      <WagmiConfig client={client}>
        <ChakraProvider>
          <ConnectKitProvider theme="midnight">
            <ThemeWrapper>
              <UserWrapper>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </UserWrapper>
            </ThemeWrapper>
          </ConnectKitProvider>
        </ChakraProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;

export const infoToast = (title, message) => {
  toast({
    title: title,
    description: message,
    status: "info",
    duration: 3500,
    isClosable: true,
    position: "top-left",
  });
};

export const errorToast = (title, message) => {
  toast({
    title: title,
    description: message,
    status: "error",
    duration: 3500,
    isClosable: true,
    position: "top-left",
  });
};

export const successToast = (title, message) => {
  toast({
    title: title,
    description: message,
    status: "success",
    duration: 3500,
    isClosable: true,
    position: "top-left",
  });
};
