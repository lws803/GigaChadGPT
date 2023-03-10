import {
  Navbar,
  Stack,
  Button,
  Divider,
  useMantineColorScheme,
  Select,
} from "@mantine/core";
import {
  IconPlus,
  IconSun,
  IconLogout,
  IconLogin,
  IconBrandGithub,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/modules/auth";
import { Persona, personaDropdownChoices } from "@/modules/openai/personas";

import { Message } from "../index/ChatInterface/types";
import { useRouter } from "next/router";

export default function Nav({
  isMenuOpened,
  setMessages,
  setIsMenuOpened,
}: Props) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { currentUser, signIn, signOut } = useAuth();
  const router = useRouter();

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!isMenuOpened}
      width={{ sm: 300, lg: 300 }}
    >
      <Stack sx={() => ({ justifyContent: "space-between", height: "100%" })}>
        <Stack>
          <Button
            size="md"
            variant="outline"
            leftIcon={<IconPlus size={16} />}
            onClick={() => {
              setMessages([]);
              setIsMenuOpened(false);
            }}
            sx={() => ({
              ".mantine-Button-inner": {
                justifyContent: "start",
              },
            })}
          >
            New chat
          </Button>
          <Select
            sx={() => ({
              ".mantine-Select-label": { marginBottom: "2px" },
            })}
            size="md"
            label="Persona"
            placeholder="Pick a persona"
            defaultValue="gigachad"
            data={personaDropdownChoices}
            onChange={(data) => {
              if (!data) return;
              const persona = Persona.is(data) ? data : "gigachad";
              router.push({ query: { persona } });
              setMessages([]);
            }}
          />
        </Stack>
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
              currentUser ? <IconLogout size={16} /> : <IconLogin size={16} />
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
            target="_blank"
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
  );
}

type Props = {
  isMenuOpened: boolean;
  setMessages: (messages: Message[]) => void;
  setIsMenuOpened: (isOpened: boolean) => void;
};
