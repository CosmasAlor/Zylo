"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface GalleryItem {
  id: string;
  beforeUrl: string;
  afterUrl: string;
  caption: string | null;
}

export function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();

        if (!res.ok) {
          const message = typeof data === "object" && data !== null && "message" in data
            ? (data as { message?: string }).message
            : undefined;

          console.error("Gallery API error", res.status, data);
          setErrorMessage(message ?? "Unable to load gallery.");
          setHasError(true);
          return;
        }

        if (!Array.isArray(data)) {
          console.error("Unexpected gallery payload", data);
          setErrorMessage("Received invalid gallery data.");
          setHasError(true);
          return;
        }

        setItems(data);
      } catch (error) {
        console.error("Failed to load gallery", error);
        setErrorMessage(error instanceof Error ? error.message : "Unable to load gallery.");
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  if (loading) return null;

  if (items.length === 0 || hasError) {
    return (
      <section className="py-24 md:py-32 bg-background relative overflow-hidden" id="transformations">
        <div className="container-app px-4 relative z-10">
          <div className="rounded-3xl border border-dashed border-muted/40 bg-muted/5 p-16 text-center">
            <p className="text-lg font-semibold text-foreground">No gallery transformations are available right now.</p>
            {hasError && (
              <p className="mt-3 text-sm text-muted-foreground">{errorMessage ?? "Unable to load the gallery at this time. Please try again later."}</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden" id="transformations">
      <div className="container-app px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold uppercase tracking-widest text-xs"
          >
            Real Transformations
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mt-4"
          >
            Smile Gallery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-4 max-w-2xl mx-auto"
          >
            Discover how we&apos;ve helped our patients reclaim their confidence through modern restorative and cosmetic dentistry.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((item, index) => (
            <BeforeAfterSlider key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfterSlider({ item, index }: { item: GalleryItem, index: number }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-[400px] rounded-3xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl"
      ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* Before Image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.beforeUrl} alt="Before" className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-tighter">
          Before
        </div>
      </div>

      {/* After Image */}
      <div
        className="absolute inset-0 border-r-2 border-white/50"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.afterUrl} alt="After" className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-md text-white text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-tighter">
          After
        </div>
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-3 bg-primary/40 rounded-full" />
            <div className="w-0.5 h-3 bg-primary/40 rounded-full" />
          </div>
        </div>
      </div>

      {item.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <h3 className="text-white font-bold text-lg">{item.caption}</h3>
        </div>
      )}
    </motion.div>
  );
}
