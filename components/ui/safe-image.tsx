"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import { useState } from "react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallback?: React.ReactNode;
}

/**
 * A wrapper around next/image that handles errors gracefully.
 * Since event handlers like onError cannot be passed from Server Components
 * to Client Components (like next/image), this Client Component wrapper
 * handles the error state internally.
 */
export function SafeImage({ src, alt, fallback, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return <>{fallback || null}</>;
  }

  // If no src is provided, don't render anything or render fallback
  if (!src) {
    return <>{fallback || null}</>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  );
}
