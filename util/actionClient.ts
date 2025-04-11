import { createSafeActionClient } from "next-safe-action";
import { randomUUID } from "node:crypto";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    const errorId = randomUUID();

    console.error(errorId, error);

    return {
      error: true,
      errorTraceId: errorId,
      reason: "Internal Server Error",
    };
  },
});
