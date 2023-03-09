import {
  Box,
  Stack,
  ScrollArea,
  TextInput,
  ActionIcon,
  MediaQuery,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconSend } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { useMediaQuery } from "@mantine/hooks";

import { post } from "@/modules/openai/actions";
import { useAuth } from "@/modules/auth";

import ChatBubble from "./ChatInterface/ChatBubble";
import { Message } from "./ChatInterface/types";

export default function ChatInterface({ messages, setMessages }: Props) {
  const { currentUser } = useAuth();

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

  const { mutate, isLoading } = useMutation<
    { content: string | null; id: string },
    unknown,
    string
  >({
    mutationFn: async (data) =>
      post(
        data,
        messages.slice(0, -1),
        (await currentUser?.getIdToken()) || ""
      ),
    onSuccess: (data) => {
      setMessages([
        ...messages,
        { role: "assistant", content: data.content || "", id: data.id },
      ]);
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
    <form
      onSubmit={form.onSubmit((values) => {
        mutate(values.message);
        setMessages([
          ...messages,
          { role: "user", content: values.message, id: uuidv4() },
        ]);
        form.reset();
      })}
    >
      <Box sx={() => ({ paddingTop: "16px" })}>
        <Stack>
          <MediaQuery styles={{ display: "none" }} smallerThan="sm">
            <ScrollArea h={"calc(100vh - 120px)"}>
              <Stack spacing={0}>
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))}
              </Stack>
            </ScrollArea>
          </MediaQuery>
          <MediaQuery styles={{ display: "none" }} largerThan="sm">
            <Stack spacing={0}>
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
            </Stack>
          </MediaQuery>
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
  );
}

type Props = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
};
