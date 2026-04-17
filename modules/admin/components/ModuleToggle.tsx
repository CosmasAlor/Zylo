"use client";

import { useState, useTransition } from "react";
import { toggleModuleStatus } from "../actions";

export function ModuleToggle({ name, initialIsActive }: { name: string; initialIsActive: boolean }) {
  const [isActive, setIsActive] = useState(initialIsActive);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState); // Optimistic update
    
    startTransition(async () => {
      const result = await toggleModuleStatus(name, newState);
      if (!result.success) {
        setIsActive(!newState); // Revert on failure
      }
    });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      onClick={handleToggle}
      disabled={isPending || name === "admin"}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        isActive ? "bg-primary" : "bg-input"
      } ${(isPending || name === "admin") ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span className="sr-only">Toggle module</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
          isActive ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}
