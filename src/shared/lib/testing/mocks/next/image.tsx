import Image from "next/image";
import React, { type ComponentProps } from "react";

export const MockImage = (props: ComponentProps<typeof Image>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { priority, placeholder, objectFit, fill, ...rest } = props;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...(rest as ComponentProps<"img">)}
      alt={props.alt || ""}
      src={getSrc(props.src)}
      width={props.width || (fill ? undefined : 5)}
      height={props.height || (fill ? undefined : 5)}
    />
  );
};

function getSrc(src: ComponentProps<typeof Image>["src"]): string | undefined {
  if (!src) return undefined;
  if (typeof src === "string") return src;
  if ("src" in src) return src.src;
  if ("default" in src) return (src.default as { src: string }).src;
  return undefined;
}

export default MockImage;
