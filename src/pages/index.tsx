import { useRef, useState } from "react";
import {
  ActionIcon,
  AppShell,
  Button,
  Divider,
  Navbar,
  Stack,
  Box,
  TextInput,
  useMantineColorScheme,
  ScrollArea,
} from "@mantine/core";
import {
  IconLogin,
  IconLogout,
  IconPlus,
  IconSend,
  IconSun,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { ChatCompletionRequestMessage } from "openai";
import { notifications } from "@mantine/notifications";

import { post } from "@/modules/openai/actions";
import ChatBubble from "@/components/index/ChatBubble";
import { useAuth } from "@/modules/auth";

export default function Home() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const messagesViewportRef = useRef<HTMLDivElement>(null);
  const { signOut, signIn, currentUser } = useAuth();

  const form = useForm({
    initialValues: { message: "" },
    validate: {
      message: (message) =>
        message === ""
          ? "Message cannot be empty"
          : !currentUser
          ? "Sign in to start chatting..."
          : null,
    },
  });

  const { mutate, isLoading } = useMutation<string | null, unknown, string>({
    mutationFn: async (data) =>
      post(
        data,
        messages.slice(0, -1),
        (await currentUser?.getIdToken()) || ""
      ),
    onSuccess: (data) => {
      setMessages([...messages, { role: "assistant", content: data || "" }]);
    },
    onError: () => {
      notifications.show({
        title: "Oops, something went wrong.",
        message: "Please try again later...",
        color: "red",
      });
    },
  });

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
      <form
        onSubmit={form.onSubmit((values) => {
          mutate(values.message);
          setMessages([...messages, { role: "user", content: values.message }]);
          form.reset();
        })}
      >
        <Box sx={() => ({ paddingTop: "16px" })}>
          <Stack>
            <ScrollArea h="calc(100vh - 120px)" ref={messagesViewportRef}>
              <Stack spacing={0}>
                {messages.reverse().map((message, index) => (
                  <ChatBubble key={index} message={message} />
                ))}
              </Stack>
            </ScrollArea>
            <TextInput
              autoComplete="off"
              sx={() => ({ width: "100%" })}
              size="md"
              rightSection={
                <ActionIcon
                  type="submit"
                  loading={isLoading}
                  disabled={!form.isValid}
                >
                  <IconSend size={14} />
                </ActionIcon>
              }
              {...form.getInputProps("message")}
            />
          </Stack>
        </Box>
      </form>
    </AppShell>
  );
}
