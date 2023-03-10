import { useRef, useEffect } from "react";
import {
  Stack,
  ScrollArea,
  ActionIcon,
  MediaQuery,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSend } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { post } from "@/modules/openai/actions";
import { useAuth } from "@/modules/auth";

import ChatBubble from "./ChatInterface/ChatBubble";
import { Message } from "./ChatInterface/types";
import ChatBubblePlaceholder from "./ChatInterface/ChatBubblePlaceholder";
import { Persona } from "@/modules/openai/personas";

const schema = yup
  .object()
  .shape({
    message: yup.string().required().max(1024),
  })
  .required();

type Inputs = { message: string };

export default function ChatInterface({
  messages,
  setMessages,
  persona,
}: Props) {
  const { currentUser } = useAuth();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { control, handleSubmit, reset, trigger } = useForm<Inputs>({
    defaultValues: { message: "" },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
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
        (await currentUser?.getIdToken()) || "",
        persona
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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data.message);
    setMessages([
      ...messages,
      { role: "user", content: data.message, id: uuidv4() },
    ]);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <MediaQuery styles={{ display: "none" }} smallerThan="sm">
          <ScrollArea h={"calc(100vh - 120px)"}>
            <Stack spacing={0}>
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  persona={persona}
                />
              ))}
              {isLoading && <ChatBubblePlaceholder persona={persona} />}
            </Stack>
          </ScrollArea>
        </MediaQuery>
        <MediaQuery styles={{ display: "none" }} largerThan="sm">
          <Stack spacing={0}>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                persona={persona}
              />
            ))}
            {isLoading && <ChatBubblePlaceholder persona={persona} />}
          </Stack>
        </MediaQuery>
        <Controller
          name="message"
          control={control}
          render={({ field, formState }) => (
            <Textarea
              {...field}
              disabled={isLoading}
              placeholder="Enter a prompt above to get the conversation going 💪"
              autoComplete="off"
              sx={() => ({ width: "100%" })}
              size="md"
              rightSection={
                <ActionIcon
                  type="submit"
                  loading={isLoading}
                  disabled={!formState.isValid}
                  size="md"
                >
                  <IconSend size={16} />
                </ActionIcon>
              }
              minRows={1}
              maxRows={2}
              autosize
              error={formState.errors.message?.message?.toString()}
              onKeyDown={async (evt) => {
                if (evt.key === "Enter" && !evt.shiftKey) {
                  evt.preventDefault();
                  const result = await trigger();
                  result && onSubmit({ message: field.value });
                }
              }}
            />
          )}
        />
      </Stack>
    </form>
  );
}

type Props = {
  messages: Message[];
  persona: Persona;
  setMessages: (messages: Message[]) => void;
};
