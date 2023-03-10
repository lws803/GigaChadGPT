/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { AppShell, Center } from "@mantine/core";
import GoogleButton from "react-google-button";

import { Message } from "@/components/index/ChatInterface/types";
import { useAuth } from "@/modules/auth";
import ChatInterface from "@/components/index/ChatInterface";
import Nav from "@/components/shared/Nav";
import Header from "@/components/shared/Header";
import { Persona } from "@/modules/openai/personas";
import { useRouter } from "next/router";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { signIn, authState } = useAuth();
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [persona, setPersona] = useState<Persona>("gigachad");

  const { query, push } = useRouter();

  useEffect(() => {
    const queryPersona = query.persona?.toString();
    if (queryPersona && Persona.is(queryPersona)) {
      setPersona(queryPersona);
      return;
    }
    push({ query: { persona: "gigachad" } });
  }, [push, query.persona]);

  return (
    <AppShell
      padding="md"
      navbar={
        <Nav
          isMenuOpened={isMenuOpened}
          setMessages={setMessages}
          setIsMenuOpened={setIsMenuOpened}
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
        <Center h="100vh">
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
