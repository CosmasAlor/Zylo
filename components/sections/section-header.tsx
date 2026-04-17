import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  badge?: string;
  title: string;
  description: string;
  center?: boolean;
  className?: string;
};

export function SectionHeader({
  badge,
  title,
  description,
  center = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(center ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      {badge ? (
        <p className="mb-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          {badge}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>
    </div>
  );
}
