/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import {
  AppShell,
  Button,
  Divider,
  Navbar,
  Stack,
  useMantineColorScheme,
  Center,
  Header,
  MediaQuery,
  Group,
  Burger,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconLogin,
  IconLogout,
  IconPlus,
  IconSun,
} from "@tabler/icons-react";
import GoogleButton from "react-google-button";
import Link from "next/link";
import Image from "next/image";

import { Message } from "@/components/index/ChatInterface/types";
import { useAuth } from "@/modules/auth";
import ChatInterface from "@/components/index/ChatInterface";

export default function Home() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const { signOut, signIn, currentUser, authState } = useAuth();
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!isMenuOpened}
          width={{ sm: 300, lg: 300 }}
        >
          <Stack
            sx={() => ({ justifyContent: "space-between", height: "100%" })}
          >
            <Button
              size="md"
              variant="outline"
              leftIcon={<IconPlus size={16} />}
              onClick={() => setMessages([])}
              sx={() => ({
                ".mantine-Button-inner": {
                  justifyContent: "start",
                },
              })}
            >
              New chat
            </Button>
            <Stack>
              <Divider />
              <Button
                variant="subtle"
                leftIcon={<IconSun size={16} />}
                sx={() => ({
                  ".mantine-Button-inner": {
                    justifyContent: "start",
                  },
                })}
                onClick={() =>
                  toggleColorScheme(colorScheme === "dark" ? "light" : "dark")
                }
              >
                {colorScheme === "dark" ? "Light" : "Dark"} mode
              </Button>
              <Button
                onClick={() => (currentUser ? signOut() : signIn())}
                variant="subtle"
                leftIcon={
                  currentUser ? (
                    <IconLogout size={16} />
                  ) : (
                    <IconLogin size={16} />
                  )
                }
                sx={() => ({
                  ".mantine-Button-inner": {
                    justifyContent: "start",
                  },
                })}
              >
                {currentUser ? "Sign out" : "Sign in"}
              </Button>
              <Button
                sx={() => ({
                  ".mantine-Button-inner": {
                    justifyContent: "start",
                  },
                })}
                variant="subtle"
                leftIcon={<IconBrandGithub size={14} />}
                component={Link}
                href="https://github.com/lws803/GigaChadGPT"
              >
                Github
              </Button>
              <a
                href="https://www.producthunt.com/posts/gigachadgpt?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-gigachadgpt"
                target="_blank"
              >
                <Image
                  src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=383111&theme=${colorScheme}`}
                  alt="GigaChadGPT - GigaChadGPT&#0032;&#0045;&#0032;the&#0032;ultimate&#0032;bro&#0032;who&#0039;s&#0032;got&#0032;your&#0032;back&#0032;24&#0047;7 | Product Hunt"
                  width={250}
                  height={54}
                  loader={({ src }) => src}
                />
              </a>
            </Stack>
          </Stack>
        </Navbar>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
      header={
        <MediaQuery styles={{ display: "none" }} largerThan="sm">
          <Header height={{ base: 60, md: 0, sm: 0 }} p="md">
            <Group sx={() => ({ justifyContent: "flex-start", width: "100%" })}>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={isMenuOpened}
                  onClick={() => setIsMenuOpened((o) => !o)}
                  size="sm"
                  mr="xl"
                />
              </MediaQuery>
            </Group>
          </Header>
        </MediaQuery>
      }
    >
      {authState === "signedOut" ? (
        <Center h="100vh">
          <GoogleButton onClick={signIn}>Sign in</GoogleButton>
        </Center>
      ) : (
        <ChatInterface messages={messages} setMessages={setMessages} />
      )}
    </AppShell>
  );
}
