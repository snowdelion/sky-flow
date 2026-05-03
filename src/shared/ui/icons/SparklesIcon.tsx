import { Sparkles } from "lucide-react";
import { CSSProperties, useId } from "react";

export function SparklesIcon({
  size = 20,
  className,
  style,
  stop1 = "#ffffff",
  stop2 = "#ffffff",
}: SparklesIconProps) {
  const id = useId();

  return (
    <>
      <svg width="0" height="0" className={`absolute ${className}`}>
        <defs>
          <linearGradient
            id={id}
            x1="60%"
            y1="90%"
            x2="20%"
            y2="40%"
            className="animate-gradient-slow"
          >
            <stop
              offset="0%"
              style={{
                stopColor: `var(--s1, ${stop1})`,
                transition: "stop-color 0.2s",
              }}
            />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop
              offset="100%"
              style={{
                stopColor: `var(--s2, ${stop2})`,
                transition: "stop-color 0.2s",
              }}
            />
          </linearGradient>
        </defs>
      </svg>

      <Sparkles
        size={size}
        className={className}
        style={{
          ...style,
          stroke: `url(#${id})`,
        }}
      />
    </>
  );
}

interface SparklesIconProps {
  size?: number;
  className?: string;
  style?: SparkleStyles;
  stop1?: string;
  stop2?: string;
  stop1Hover?: string;
  stop2Hover?: string;
}

interface SparkleStyles extends CSSProperties {
  "--s1"?: string;
  "--s2"?: string;
}
