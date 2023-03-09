import React, { useEffect } from "react";
import { Center } from "@mantine/core";
import { useRouter } from "next/router";
import GoogleButton from "react-google-button";

import { useAuth } from "@/modules/auth";

export default function SignIn() {
  const { signIn, authState, signOut } = useAuth();
  const router = useRouter();
  const backRoute = router.query.back;

  useEffect(() => {
    if (authState === "signedIn" && typeof backRoute === "string") {
      router.push(decodeURIComponent(backRoute));
    }
  }, [authState, backRoute, router]);

  return (
    <Center sx={() => ({ minHeight: "70vh" })}>
      <GoogleButton
        label={authState === "signedOut" ? "Sign in with Google" : "Sign out"}
        onClick={authState === "signedOut" ? signIn : signOut}
      />
    </Center>
  );
}
