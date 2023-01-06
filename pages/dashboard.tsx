import { Button, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";

import { UserContext } from "../context/userProvider";

export default function Dashboard() {
  const { user, setUser } = useContext(UserContext);

  const router = useRouter();

  const handleLogout = () => {
    router.push("/api/auth/logout");
  };

  const handleGetUser = () => {
    setUser({ id: 1, name: "ayamew" });
  };

  return (
    <>
      <>
        <Head>
          <title>Momban Sapmple App</title>
          <meta content="This is sample app with momban" name="description" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link href="/favicon.ico" rel="icon" />
        </Head>
        <Flex
          alignItems="center"
          flexDirection="column"
          h="calc(100dvh)"
          justifyContent="center"
          w="calc(100dvw)"
        >
          <Button colorScheme="blue" onClick={handleLogout}>
            Logout
          </Button>

          <Button colorScheme="blue" mt="32px" onClick={handleGetUser}>
            Get User
          </Button>
          <Text mt="32px">User is {JSON.stringify(user)}</Text>
        </Flex>
      </>
    </>
  );
}
