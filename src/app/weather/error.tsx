"use client";

import { PageError } from "@/shared/ui";

export default function WeatherPageError({ error, reset }: PageError) {
  return <PageError message={error.message} reset={reset} />;
}

type PageError = {
  error: Error;
  reset: () => void;
};
