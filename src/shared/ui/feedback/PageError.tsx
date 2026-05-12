"use client";
import { AppIcon } from "../icons/AppIcon";

export function PageError({
  message = "Unexpected error...",
  reset,
}: PageErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-15">
        <h2 className="text-3xl font-bold">{message}</h2>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-3 bg-[hsl(243,27%,20%)] hover:bg-[hsl(243,23%,24%)] transition rounded-lg"
        >
          <AppIcon icon="retry" alt="Retry" width={16} />
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
}

export interface PageErrorProps {
  message?: string;
  reset: () => void;
}
