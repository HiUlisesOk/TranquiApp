"use client";

import { Input } from "@/components/ui/input";

export function MonthSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Input type="month" value={value} onChange={(e) => onChange(e.target.value)} className="max-w-xs" />;
}
