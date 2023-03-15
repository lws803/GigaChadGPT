import { useRef, useEffect } from "react";
import { Stack, ActionIcon, Textarea, Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSend } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as Sentry from "@sentry/browser";

import { post } from "@/modules/openai/actions";
import { useAuth } from "@/modules/auth";

import ChatBubble from "./ChatInterface/ChatBubble";
import { Message } from "./ChatInterface/types";
import ChatBubblePlaceholder from "./ChatInterface/ChatBubblePlaceholder";
import { Persona } from "@/modules/openai/personas";
import { useMediaQuery } from "@mantine/hooks";

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
  const isSmallScreen = useMediaQuery("(max-width:768px)");

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
    onError: (data) => {
      Sentry.captureException(data);
      notifications.show({
        title: "Oops, something went wrong.",
        message:
          "Please refresh the page and try a different prompt. We will be fixing this bug shortly.",
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
      <Stack spacing={0} pb={`${isSmallScreen ? 100 : 180}px`}>
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} persona={persona} />
        ))}
        {isLoading && <ChatBubblePlaceholder persona={persona} />}
      </Stack>

      <Box
        sx={(theme) => ({
          width: "100%",
          position: "fixed",
          bottom: "0px",
          left: "0px",
          paddingLeft: "calc(var(--mantine-navbar-width, 0px) + 1rem)",
          paddingRight: "calc(var(--mantine-aside-width, 0px) + 1rem)",
          paddingBottom: "20px",
          paddingTop: "20px",
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : "#fff",
        })}
      >
        <Controller
          name="message"
          control={control}
          render={({ field, formState }) => (
            <Textarea
              {...field}
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
              minRows={isSmallScreen ? 1 : 4}
              maxRows={4}
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
      </Box>
    </form>
  );
}

type Props = {
  messages: Message[];
  persona: Persona;
  setMessages: (messages: Message[]) => void;
};
