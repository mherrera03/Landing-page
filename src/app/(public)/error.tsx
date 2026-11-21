"use client";

import { ErrorMessage } from "@/components/public/layout/ErrorMessage";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorMessage error={error} retry={retry} />;
}
