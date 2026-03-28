"use client";
import Image from "next/image";

import { retryIcon } from "@/shared";

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-15">
        <h2 className="text-3xl font-bold">
          {error.message || "Unexpected error..."}
        </h2>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-3 bg-[hsl(243,27%,20%)] hover:bg-[hsl(243,23%,24%)] transition rounded-lg"
        >
          <Image src={retryIcon} alt="Retry" />
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
}

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
