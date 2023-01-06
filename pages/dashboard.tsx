import { Button, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useContext, useEffect } from "react";

import { UserContext } from "../context/userProvider";

export default function Dashboard() {
  const cookies = parseCookies(null, undefined);
  console.log(cookies);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    async function getMe() {
      setUser(await (await fetch("/api/auth/me")).json());
    }
    getMe();
  }, [setUser]);

  const router = useRouter();

  const handleLogout = () => {
    router.push("/api/auth/logout");
  };

  const handleGetUser = async () => {
    setUser(await (await fetch("/api/auth/me")).json());
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
          {user && <Text mt="32px">User is {JSON.stringify(user?.name)}</Text>}
        </Flex>
      </>
    </>
  );
}
