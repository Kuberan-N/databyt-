"use client";

interface LogoProps {
  variant?: "dark" | "light";
  size?: number;
  href?: string;
}

export default function Logo({ variant = "dark", size = 22, href = "#" }: LogoProps) {
  const wordColor = variant === "dark" ? "#0A0A0A" : "#FFFFFF";
  const dotSize = Math.round(size / 5.5);

  return (
    <a
      href={href}
      className="inline-flex items-baseline font-heading transition-opacity duration-300 hover:opacity-80"
      style={{
        fontSize: `${size}px`,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        lineHeight: 1,
        color: wordColor,
      }}
      aria-label="databyt — home"
    >
      <span>databyt</span>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          borderRadius: "50%",
          background: "#0066FF",
          marginLeft: "3px",
          alignSelf: "flex-end",
          marginBottom: `${Math.max(2, Math.round(size / 11))}px`,
        }}
      />
    </a>
  );
}
