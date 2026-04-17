"use client";

import * as React from "react";
import { BookingModal } from "@/modules/appointments/components/booking-modal";

interface BookingContextType {
  open: () => void;
  close: () => void;
}

const BookingContext = React.createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <BookingContext.Provider value={{ open, close }}>
      {children}
      <BookingModal isOpen={isOpen} onClose={close} />
    </BookingContext.Provider>
  );
}

export function useBookingModal() {
  const context = React.useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookingModal must be used within a BookingProvider");
  }
  return context;
}
