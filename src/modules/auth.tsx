import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { useRouter } from "next/router";

import getFirebase from "@/shared/getFirebase";

type AuthState = "unknown" | "signedIn" | "signedOut" | "error";

type UserContext = {
  currentUser: User | null;
  authState: AuthState;
};

const INITIAL_CONTEXT: UserContext = {
  currentUser: null,
  authState: "unknown",
};

const Context = createContext<UserContext>(INITIAL_CONTEXT);

export function AuthContext({ children }: React.PropsWithChildren) {
  const app = getFirebase();

  const auth = getAuth(app);

  const [authContext, setAuthContext] = useState<UserContext>(INITIAL_CONTEXT);

  useEffect(() => {
    return auth.onAuthStateChanged(
      async (user) => {
        if (user) {
          setAuthContext({
            currentUser: user,
            authState: "signedIn",
          });
        } else {
          setAuthContext({
            authState: "signedOut",
            currentUser: null,
          });
        }
      },
      () =>
        setAuthContext({
          currentUser: null,
          authState: "error",
        })
    );
  }, [auth]);

  return <Context.Provider value={authContext}>{children}</Context.Provider>;
}

export function useAuth() {
  const app = getFirebase();
  const auth = getAuth(app);
  const authContext = useContext(Context);
  const router = useRouter();

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.reload();
    } catch (_e) {}
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return {
    signIn,
    signOut,
    isSigningIn: authContext.authState === "unknown",
    currentUser: authContext.currentUser,
    authState: authContext.authState,
    isError: authContext.authState === "error",
  };
}

export function AuthRequired({ children }: React.PropsWithChildren) {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState === "signedOut") {
      router.push(`/signin?back=${encodeURIComponent(router.asPath)}`);
    }
  }, [authState, router]);

  return <>{children}</>;
}

export type AuthHeader = {
  idToken: string;
};
