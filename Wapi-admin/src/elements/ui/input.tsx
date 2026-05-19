import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type === "number") {
        const isControlKey =
          ["Backspace", "Delete", "Tab", "Escape", "Enter", "Home", "End", "ArrowLeft", "ArrowRight"].includes(e.key) ||
          (e.ctrlKey === true && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) ||
          (e.metaKey === true && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase()));

        if (!isControlKey && !/^\d$/.test(e.key)) {
          e.preventDefault();
        }
      }
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    return (
      <input
        type={type}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-9 w-full rounded-lg border border-input bg-transparent text-base px-2 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
