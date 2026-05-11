"use client";
import { AppIcon } from "../icons/AppIcon";

export function NetworkError({ message, refetch }: NetworkErrorProps) {
  return (
    <div className="flex flex-col items-center gap-10">
      <h2 className="text-3xl font-bold">{message}</h2>
      <button
        onClick={refetch}
        className="flex items-center gap-2 px-4 py-3 bg-[hsl(243,27%,20%)] hover:bg-[hsl(243,23%,24%)] transition rounded-lg"
      >
        <AppIcon icon="retry" alt="Retry" />
        <span>Retry</span>
      </button>
    </div>
  );
}

interface NetworkErrorProps {
  message: string;
  refetch: () => void;
}
