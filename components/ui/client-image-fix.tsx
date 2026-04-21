"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import { useState } from "react";

interface ClientImageFixProps extends ImageProps {
  /**
   * Optional CSS selector for a fallback element to show when the image fails to load.
   * Useful for legacy structures where fallbacks are siblings in the DOM.
   */
  fallbackSelector?: string;
}

/**
 * A Client Component wrapper for next/image that prevents "Event handler" errors
 * when used in Server Components, while supporting external fallbacks.
 */
export function ClientImageFix({ src, fallbackSelector, ...props }: ClientImageFixProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return null;
  }

  return (
    <Image
      {...props}
      src={src}
      alt={props.alt || ""}
      onError={() => {
        setError(true);
        if (fallbackSelector) {
          const fallback = document.querySelector(fallbackSelector) as HTMLElement;
          if (fallback) {
            fallback.style.display = "block";
            // Remove 'hidden' class if it's being used by Tailwind/CSS
            fallback.classList.remove("hidden");
          }
        }
      }}
    />
  );
}
