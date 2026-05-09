export const getBaseUrl = () => {
  if (typeof window === "undefined")
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return "";
};
