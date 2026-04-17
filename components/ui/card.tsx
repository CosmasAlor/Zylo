import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-2xl border bg-card text-card-foreground", {
  variants: {
    variant: {
      default: "border-border shadow-sm",
      elevated: "border-transparent shadow-lg",
      outlined: "border-primary/20 shadow-none",
    },
    spacing: {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    spacing: "md",
  },
});

type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

function Card({ className, variant, spacing, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, spacing }), className)}
      data-slot="card"
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 pb-4", className)}
      data-slot="card-header"
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-xl font-semibold leading-tight tracking-tight", className)}
      data-slot="card-title"
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      data-slot="card-description"
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} data-slot="card-content" {...props} />;
}

export {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cardVariants,
};
