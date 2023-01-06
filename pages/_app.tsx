import { ChakraProvider } from "@chakra-ui/react";

import { UserProvider } from "../context/userProvider";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const user = { name: "ayamew" };
  return (
    <UserProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </UserProvider>
  );
}
