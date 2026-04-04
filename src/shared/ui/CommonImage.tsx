import Image, { type ImageProps } from "next/image";
import { memo } from "react";
import { ASSETS } from "../assets";

export const CommonImage = memo(function CommonImage({
  image,
  alt = "Background",
  ...props
}: CommonImageProps) {
  const src = ASSETS.images[image];
  return <Image src={src} alt={alt} {...props} />;
});

interface CommonImageProps extends Omit<ImageProps, "src"> {
  image: keyof typeof ASSETS.images;
  alt: string;
}
