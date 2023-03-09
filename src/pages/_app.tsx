import { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { getAnalytics } from "firebase/analytics";

import getFirebase from "@/shared/getFirebase";
import { AuthContext } from "@/modules/auth";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "dark",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const app = getFirebase();
      getAnalytics(app);
    }
  }, []);

  return (
    <>
      <Head>
        <title>GigaChadGPT</title>
        <meta
          name="description"
          content={
            "Meet our giga chad chat bot - the ultimate conversation companion for the modern " +
            "alpha male. With unmatched conversation skills and a confident personality, " +
            "our bot provides witty comebacks and engaging conversations. Experience the power of " +
            "true masculinity in every chat. Chat with our giga chad bot now."
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="og:title" content="GigaChadGPT" />
        <meta
          name="og:description"
          content={
            "Meet our giga chad chat bot - the ultimate conversation companion for the modern " +
            "alpha male. With unmatched conversation skills and a confident personality, " +
            "our bot provides witty comebacks and engaging conversations. Experience the power of " +
            "true masculinity in every chat. Chat with our giga chad bot now."
          }
        />
        <meta name="og:image" content="/gigachad.jpg" />
        <meta name="og:url" content="https://chat.getgigachad.com" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <AuthContext>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={{ colorScheme, primaryColor: "gray" }}
            >
              <Notifications />
              <Component {...pageProps} />
            </MantineProvider>
          </ColorSchemeProvider>
        </AuthContext>
      </QueryClientProvider>
    </>
  );
}
