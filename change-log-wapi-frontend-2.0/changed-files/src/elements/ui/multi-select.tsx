"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/elements/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";
import { cn } from "@/src/lib/utils";

export type Option = {
  label: string;
  value: string;
  color?: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({ options, selected, onChange, placeholder = "Select items...", className }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" aria-expanded={open} className={cn("w-full justify-between h-auto min-h-10 hover:bg-transparent", selected.length > 0 ? "h-auto" : "h-10", className)}>
          <div className="flex flex-wrap gap-1 custom-scrollbar">
            {selected.length === 0 && <span className="text-muted-foreground font-normal">{placeholder}</span>}
            {selected.map((item) => {
              const option = options.find((o) => o.value === item);
              return (
                <Badge variant="secondary" key={item} className="mr-1 mb-1 break-all whitespace-normal max-w-full dark:bg-(--card-color)" style={{ backgroundColor: option?.color ? `${option.color}20` : undefined, color: option?.color }}>
                  <span className="flex-1">{option?.label || item}</span>
                  <div
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <span className="sr-only">Remove {option?.label || item}</span>✕
                  </div>
                </Badge>
              );
            })}
          </div>
          {false && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0 " align="start">
        <Command className="w-full">
          <CommandInput placeholder="Search..." />
          <CommandList className="max-h-64 overflow-y-auto custom-scrollbar">
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup className="p-0 overflow-visible">
              {options.length > 0 && (
                <>
                  <CommandItem
                    className="flex items-center gap-2 cursor-pointer px-2 py-1.5 font-semibold text-primary"
                    onSelect={() => {
                      if (selected.length === options.length) {
                        onChange([]);
                      } else {
                        onChange(options.map((option) => option.value));
                      }
                    }}
                  >
                    <div className={cn("flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selected.length === options.length ? "bg-primary text-primary-foreground" : "opacity-50")}>
                      {selected.length === options.length && <Check className="h-3 w-3" />}
                    </div>
                    {selected.length === options.length ? "Unselect All" : "Select All"}
                  </CommandItem>
                  <div className="h-px bg-slate-100 dark:bg-(--card-color) my-1" />
                </>
              )}
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer px-2 py-1.5"
                  onSelect={() => {
                    onChange(selected.includes(option.value) ? selected.filter((item) => item !== option.value) : [...selected, option.value]);
                  }}
                >
                  <Check className={cn("h-4 w-4 shrink-0", selected.includes(option.value) ? "opacity-100" : "opacity-0")} />
                  {option.color && <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: option.color }} />}
                  <span className="truncate flex-1">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
