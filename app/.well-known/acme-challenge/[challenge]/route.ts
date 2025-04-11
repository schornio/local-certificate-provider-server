import { readFile } from "node:fs/promises";

export async function GET(
  _request: unknown,
  { params }: { params: Promise<{ challenge: string }> }
) {
  const CERTBOT_WEBROOT_PATH = process.env.CERTBOT_WEBROOT_PATH!;
  const { challenge } = await params;
  const data = await readFile(
    `${CERTBOT_WEBROOT_PATH}/.well-known/acme-challenge/${challenge}`
  );
  return new Response(data);
}
