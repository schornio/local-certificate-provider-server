import { enforceEnv } from "@/util/enforceEnv";
import { randomUUID } from "crypto";
import { exec as execCB } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

const exec = promisify(execCB);

export async function generateCertificate(prefix: string) {
  const CERTBOT_WEBROOT_PATH = enforceEnv("CERTBOT_WEBROOT_PATH");
  const BASE_DOMAIN = enforceEnv("BASE_DOMAIN");
  const EMAIL = enforceEnv("EMAIL");

  const uuid = randomUUID();
  const domain = `${prefix}.${uuid}.${BASE_DOMAIN}`;

  await exec(
    `certbot certonly --non-interactive --agree-tos --email ${EMAIL} --webroot -w ${CERTBOT_WEBROOT_PATH} -d ${domain}`
  );

  const certificateFolderPath = `/etc/letsencrypt/live/${domain}`;
  const certificate = await readFile(`${certificateFolderPath}/fullchain.pem`);
  const privateKey = await readFile(`${certificateFolderPath}/privkey.pem`);

  return {
    certificate: certificate.toString("utf-8"),
    domain,
    uuid,
    privateKey: privateKey.toString("utf-8"),
  };
}
