import type { NextApiRequest, NextApiResponse } from "next";
import status from "http-status";

import { getFirebaseApp } from "@/api/shared/firebaseApp";
import { verifyIdToken } from "@/api/shared/auth";
import { errorHandler } from "@/api/shared/handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  try {
    if (req.method === "POST") {
      const firebaseApp = getFirebaseApp();

      const idToken = req.headers.authorization || "";
      await verifyIdToken(firebaseApp, idToken);

      return res.status(status.OK).end();
    }
  } catch (e) {
    errorHandler(e, res);
  }
  return res.status(status.NOT_FOUND).end();
}
