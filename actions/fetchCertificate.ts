"use server";

import { actionClient } from "@/util/actionClient";
import { encryptData } from "@/util/encryptData";
import { enforceEnv } from "@/util/enforceEnv";
import { generateCertificate } from "@/util/generateCertificate";
import { compare } from "bcryptjs";
import { z } from "zod";

export const fetchCertificate = actionClient
  .schema(z.object({ password: z.string() }))
  .action(async ({ parsedInput: { password } }) => {
    const WEB_ACCESS_PASSWORD = enforceEnv("WEB_ACCESS_PASSWORD");

    const samePassword = await compare(WEB_ACCESS_PASSWORD, password);
    if (!samePassword) throw new Error("Unauthorized");

    const CERTIFICATE_ENCRYPTION_KEY = enforceEnv("CERTIFICATE_ENCRYPTION_KEY");

    const webCertificate = await generateCertificate("web");
    const dbCertificate = await generateCertificate("db");

    const certificates = { web: webCertificate, db: dbCertificate };

    const certificatesSerialized = JSON.stringify(certificates);
    const certificatesEncrypted = await encryptData(
      certificatesSerialized,
      CERTIFICATE_ENCRYPTION_KEY
    );

    const fileContent = JSON.stringify(certificatesEncrypted);
    const fileBuffer = Buffer.from(fileContent);
    const fileBase64 = fileBuffer.toString("base64url");

    return `data:application/octet-stream;base64,${fileBase64}`;
  });
