import { InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { AppShell, Box, Center } from "@mantine/core";
import GoogleButton from "react-google-button";

import { Message } from "@/components/index/ChatInterface/types";
import { useAuth } from "@/modules/auth";
import ChatInterface from "@/components/index/ChatInterface";
import Nav from "@/components/shared/Nav";
import Header from "@/components/shared/Header";
import { Persona } from "@/modules/openai/personas";

export function getServerSideProps({
  query,
}: {
  query: { persona: Persona };
}): { props: { persona: Persona } } {
  const queryPersona = query?.persona;
  if (queryPersona && Persona.is(queryPersona)) {
    return { props: { persona: queryPersona } };
  }

  return { props: { persona: "gigachad" } };
}

export default function Home({
  persona,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { signIn, authState } = useAuth();
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  return (
    <Box
      sx={() => ({
        ".mantine-AppShell-root": {
          minHeight: "100%",
          height: "100%",
        },
        height: "100%",
      })}
    >
      <AppShell
        padding="md"
        sx={() => ({
          ".mantine-Navbar-root": { height: "100%", minHeight: "100%" },
          ".mantine-AppShell-main": {
            minHeight: "100%",
            height: "100%",
            position: "relative",
            backgroundColor: "transparent",
          },
          ".mantine-AppShell-body": {
            minHeight: "100%",
            height: "100%",
          },
        })}
        navbar={
          <Nav
            isMenuOpened={isMenuOpened}
            setMessages={setMessages}
            setIsMenuOpened={setIsMenuOpened}
            persona={persona}
          />
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
          <Header
            isMenuOpened={isMenuOpened}
            setIsMenuOpened={setIsMenuOpened}
            persona={persona}
          />
        }
      >
        {authState === "signedOut" ? (
          <Center h="100%">
            <GoogleButton onClick={signIn}>Sign in</GoogleButton>
          </Center>
        ) : (
          <ChatInterface
            messages={messages}
            setMessages={setMessages}
            persona={persona}
          />
        )}
      </AppShell>
    </Box>
  );
}
