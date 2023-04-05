import { NextApiResponse } from "next";
import { ZodError } from "zod";
import status from "http-status";
import * as Sentry from "@sentry/nextjs";

import { FirebaseAuthError } from "./auth";
import { BadRequestException, ForbiddenException } from "./exceptions";

export const errorHandler = (e: unknown | Error, res: NextApiResponse) => {
  if (e instanceof FirebaseAuthError)
    return res.status(status.UNAUTHORIZED).json({
      message: "User not authenticated, please sign in and try again.",
    });

  if (e instanceof BadRequestException)
    return res.status(status.BAD_REQUEST).json({ message: e.message });

  if (e instanceof ForbiddenException)
    return res.status(status.FORBIDDEN).json({ message: e.message });

  if (e instanceof ZodError)
    return res
      .status(status.BAD_REQUEST)
      .json({ message: "Validation error.", errors: e.errors });

  Sentry.captureException(e);

  return res
    .status(status.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal server error." });
};
