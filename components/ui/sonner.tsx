"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";
// Note: next-themes is web-only. For React Native, use a simple theme context or remove theme support.
// import { useTheme } from "next-themes";

const Toaster = ({ ...props }: ToasterProps) => {
  // React Native doesn't support next-themes. Use "light" as default or implement your own theme system.
  const theme = "light"; // or props.theme || "light"

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
