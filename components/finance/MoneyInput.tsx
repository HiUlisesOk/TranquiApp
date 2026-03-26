"use client";

import { Input } from "@/components/ui/input";

export function MoneyInput({ value, onChange, placeholder }: { value: number; onChange: (value: number) => void; placeholder?: string }) {
  return (
    <Input
      type="number"
      step="0.01"
      value={Number.isNaN(value) ? "" : value}
      placeholder={placeholder}
      onChange={(e) => onChange(Number(e.target.value || 0))}
    />
  );
}
