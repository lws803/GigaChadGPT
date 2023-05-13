import { useEffect } from "react";
import LogRocket from "logrocket";

import { useAuth } from "@/modules/auth";

export default function LogRocketAnalytics() {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_LOG_ROCKET_KEY) {
      LogRocket.init(process.env.NEXT_PUBLIC_LOG_ROCKET_KEY);
      currentUser &&
        LogRocket.identify(currentUser?.uid, {
          email: currentUser.email ?? false,
        });
    }
  }, [currentUser]);

  return null;
}
