import { Box, Stack, ScrollArea, TextInput, ActionIcon } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconSend } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { ChatCompletionRequestMessage } from "openai";

import { post } from "@/modules/openai/actions";
import { useAuth } from "@/modules/auth";

import ChatBubble from "./ChatBubble";

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
    <form
      onSubmit={form.onSubmit((values) => {
        mutate(values.message);
        setMessages([...messages, { role: "user", content: values.message }]);
        form.reset();
      })}
    >
      <Box sx={() => ({ paddingTop: "16px" })}>
        <Stack>
          <ScrollArea h="calc(100vh - 120px)">
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
  );
}

type Props = {
  messages: ChatCompletionRequestMessage[];
  setMessages: (messages: ChatCompletionRequestMessage[]) => void;
};
