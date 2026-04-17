"use client";

import * as React from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Testimonial {
  name: string;
  role?: string;
  text?: string;
  quote?: string;
  rating: number;
}

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [startIndex, setStartIndex] = React.useState(0);
  


  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (!items || items.length === 0) return null;

  // Circular items logic
  const getVisibleItems = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(items[(startIndex + i) % items.length]);
    }
    return visible;
  };

  const visibleItems = getVisibleItems();

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden px-4 md:px-12">
        <div className="flex gap-6 py-8">
          <AnimatePresence initial={false} mode="popLayout">
            {visibleItems.map((item, idx) => (
              <motion.div
                key={`${item.name}-${(startIndex + idx) % items.length}`}
                layout
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`flex-1 min-w-0 ${idx > 0 ? "hidden md:block" : "block"}`}
              >
                <Card className="flex h-full flex-col rounded-3xl border border-border/70 bg-background/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-primary/5">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (item.rating || 5)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <blockquote className="flex-1 text-sm italic leading-relaxed text-foreground md:text-base">
                    &quot;{item.text || item.quote}&quot;
                  </blockquote>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {item.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">{item.name}</p>
                      <p className="truncate text-xs font-medium text-muted-foreground">
                        {item.role || "Verified Patient"}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-border/70 bg-background shadow-sm hover:bg-primary hover:text-primary-foreground md:h-12 md:w-12"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </Button>

        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setStartIndex(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                i === startIndex ? "w-6 bg-primary" : "w-1.5 bg-primary/20 hover:bg-primary/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-border/70 bg-background shadow-sm hover:bg-primary hover:text-primary-foreground md:h-12 md:w-12"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>
    </div>
  );
}
