"use client";

import * as React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingForm } from "./booking-form";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-background shadow-2xl"
          >
            {/* Header Decorations */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-primary" />
            
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-10 rounded-full bg-secondary p-2 text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="max-h-[90vh] overflow-y-auto p-8 md:p-12">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Reserve Your Visit
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Experience world-class dental excellence at Zylo Juba. Fill out the form below and we&apos;ll reach out to confirm your session.
                </p>
              </div>

              <BookingForm />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
