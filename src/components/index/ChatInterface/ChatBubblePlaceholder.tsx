import { useEffect, useRef } from "react";
import { Group, Avatar, Box, useMantineTheme, Loader } from "@mantine/core";
import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";

import { Persona, personaProfileImages } from "@/modules/openai/personas";

export default function ChatBubblePlaceholder({ persona }: Props) {
  const theme = useMantineTheme();
  const ref = useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery("(max-width:768px)");

  const bgColors = {
    assistant:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[3],
    user:
      theme.colorScheme === "dark"
        ? theme.colors.gray[9]
        : theme.colors.gray[1],
  };
  useEffect(() => {
    !isSmallScreen && ref.current?.scrollIntoView(true);
  }, [isSmallScreen]);

  return (
    <Box
      sx={() => ({
        backgroundColor: bgColors.assistant,
        padding: "24px",
      })}
      ref={ref}
    >
      <Group
        sx={() => ({
          flexWrap: "nowrap",
          alignItems: "flex-start",
        })}
      >
        <Avatar radius="xl">
          <Image
            width={38}
            height={38}
            style={{ objectFit: "cover" }}
            src={personaProfileImages[persona]}
            alt="Giga chad avatar"
            priority
          />
        </Avatar>
        <Box mt="4px">
          <Loader variant="dots" />
        </Box>
      </Group>
    </Box>
  );
}

type Props = {
  persona: Persona;
};
