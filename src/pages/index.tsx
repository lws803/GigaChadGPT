import { useState } from "react";
import {
  AppShell,
  Button,
  Divider,
  Navbar,
  Stack,
  useMantineColorScheme,
  Center,
  Text,
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

import { Message } from "@/components/index/ChatInterface/types";
import { useAuth } from "@/modules/auth";
import ChatInterface from "@/components/index/ChatInterface";

export default function Home() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const { signOut, signIn, currentUser, authState } = useAuth();

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden
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

          paddingTop: "0px",
          paddingBottom: "0px",
        },
      })}
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
