"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useBookingModal } from "@/modules/appointments/components/booking-provider";

interface BookingButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function BookingButton({ children, ...props }: BookingButtonProps) {
  const { open } = useBookingModal();

  return (
    <Button 
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        open();
      }} 
      {...props}
    >
      {children}
    </Button>
  );
}
