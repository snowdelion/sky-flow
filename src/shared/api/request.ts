import { throwResponseErrors } from "./error-handler";

export async function request(
  url: string,
  config: RequestInit = {},
  errorCode?: string,
  allow404 = false,
) {
  const response = await fetch(url, config);

  if (!response.ok) {
    config.signal?.throwIfAborted();
    if (response.status === 404 && allow404) return null;
    throwResponseErrors(response.status, errorCode);
  }

  return response.json();
}
