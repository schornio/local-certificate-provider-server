"use client";

import { fetchCertificate } from "@/actions/fetchCertificate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { genSaltSync, hashSync } from "bcryptjs";
import { Download, RotateCw } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useCallback, useState } from "react";

export default function Page() {
  const [downloadLink, setDownloadLink] = useState<string>();

  const { execute, hasErrored, hasSucceeded, isIdle, isPending } = useAction(
    fetchCertificate,
    {
      onSuccess({ data }) {
        setDownloadLink(data);
      },
    }
  );

  const onFormSubmit = useCallback(
    (formData: FormData) => {
      const passwordPlain = formData.get("password");
      if (typeof passwordPlain !== "string") return;

      const salt = genSaltSync(10);
      const password = hashSync(passwordPlain, salt);

      execute({ password });
    },
    [execute]
  );

  return (
    <div className="p-5 flex gap-5 flex-col max-w-xl mx-auto">
      <h1 className="font-bold text-3xl text-center">
        Local certificate provider
      </h1>

      {isIdle ? (
        <form action={onFormSubmit} className="flex gap-2">
          <Input name="password" placeholder="Password" />
          <Button type="submit">Generate Certificate</Button>
        </form>
      ) : undefined}

      {isPending ? (
        <div className="min-h-40 rounded-md bg-muted flex items-center justify-center flex-col gap-2">
          <RotateCw className="animate-spin" />
          <span className="text-xs">This may take a while</span>
        </div>
      ) : undefined}

      {hasSucceeded && downloadLink ? (
        <div className="min-h-40 rounded-md border border-green-300 flex items-center justify-center flex-col gap-2">
          <h2 className="font-bold text-xl">Success</h2>
          <Button asChild>
            <Link download="certificate" href={downloadLink}>
              Download certificate <Download />
            </Link>
          </Button>
        </div>
      ) : undefined}

      {hasErrored ? (
        <div className="min-h-40 rounded-md border border-red-300 flex items-center justify-center flex-col gap-2">
          <h2 className="font-bold text-xl">Error</h2>
          <span>Please try again later</span>
        </div>
      ) : undefined}

      <div>
        by <Link href="https://schorn.ai">schorn.ai</Link>
      </div>
    </div>
  );
}
