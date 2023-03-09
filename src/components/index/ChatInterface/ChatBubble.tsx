import { useEffect, useRef } from "react";
import { Group, Avatar, Box, Text, useMantineTheme } from "@mantine/core";
import { ChatCompletionRequestMessage } from "openai";
import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";

import GigaChadImage from "../../../../public/gigachad.jpg";
import { useAuth } from "@/modules/auth";

const DICE_BEAR_AVATAR_BASE_URL = "https://api.dicebear.com/5.x/initials/svg";

export default function ChatBubble({ message }: Props) {
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

  const { currentUser } = useAuth();

  return (
    <Box
      sx={() => ({
        backgroundColor:
          message.role === "assistant" ? bgColors.assistant : bgColors.user,
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
          {message.role === "assistant" ? (
            <Image
              width={38}
              height={38}
              style={{ objectFit: "cover" }}
              src={GigaChadImage}
              alt="Giga chad avatar"
              priority
            />
          ) : (
            <Image
              width={38}
              height={38}
              style={{ objectFit: "cover" }}
              loader={({ src }) => src}
              src={
                currentUser?.photoURL ||
                `${DICE_BEAR_AVATAR_BASE_URL}?seed=${currentUser?.email}`
              }
              alt="User avatar"
              priority
            />
          )}
        </Avatar>
        <Text mt="4px" size="md">
          {message.content}
        </Text>
      </Group>
    </Box>
  );
}

type Props = {
  message: ChatCompletionRequestMessage;
};
