import Image, { type ImageProps } from "next/image";
import { memo } from "react";
import { WEATHER_ASSETS } from "../assets";

export const WeatherIcon = memo(function WeatherIcon({
  code,
  ...props
}: WeatherIconProps) {
  const src = ICON_MAP[code] ?? WEATHER_ASSETS.weather.sunny;

  return (
    <Image
      src={src}
      width={5}
      height={5}
      unoptimized
      alt="Weather icon"
      className={props.className}
      {...props}
    />
  );
});

const ICON_MAP: Record<number, string> = {
  0: WEATHER_ASSETS.weather.sunny,
  1: WEATHER_ASSETS.weather.sunny,
  2: WEATHER_ASSETS.weather.partlyCloudy,
  3: WEATHER_ASSETS.weather.overcast,
  45: WEATHER_ASSETS.weather.fog,
  48: WEATHER_ASSETS.weather.fog,
  51: WEATHER_ASSETS.weather.drizzle,
  53: WEATHER_ASSETS.weather.drizzle,
  55: WEATHER_ASSETS.weather.drizzle,
  56: WEATHER_ASSETS.weather.drizzle,
  57: WEATHER_ASSETS.weather.drizzle,
  61: WEATHER_ASSETS.weather.rain,
  63: WEATHER_ASSETS.weather.rain,
  65: WEATHER_ASSETS.weather.rain,
  66: WEATHER_ASSETS.weather.rain,
  67: WEATHER_ASSETS.weather.rain,
  71: WEATHER_ASSETS.weather.snow,
  73: WEATHER_ASSETS.weather.snow,
  75: WEATHER_ASSETS.weather.snow,
  77: WEATHER_ASSETS.weather.snow,
  80: WEATHER_ASSETS.weather.rain,
  81: WEATHER_ASSETS.weather.rain,
  82: WEATHER_ASSETS.weather.rain,
  85: WEATHER_ASSETS.weather.snow,
  86: WEATHER_ASSETS.weather.snow,
  95: WEATHER_ASSETS.weather.storm,
  96: WEATHER_ASSETS.weather.storm,
  99: WEATHER_ASSETS.weather.storm,
};

interface WeatherIconProps extends Omit<ImageProps, "src" | "alt"> {
  code: number;
}
