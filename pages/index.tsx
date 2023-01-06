import { Button, Flex } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleOnClick = () => {
    router.push("/api/auth/login");
  };

  return (
    <>
      <Head>
        <title>Momban Sapmple App</title>
        <meta content="This is sample app with momban" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Flex alignItems="center" h="calc(100dvh)" justifyContent="center" w="calc(100dvw)">
        <Button colorScheme="blue" onClick={handleOnClick}>
          Login with momban
        </Button>
      </Flex>
    </>
  );
}
