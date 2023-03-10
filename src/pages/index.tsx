import { InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { AppShell, Center } from "@mantine/core";
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
    <AppShell
      padding="md"
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
        <Center h="calc(100vh - 100px)">
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
  );
}
