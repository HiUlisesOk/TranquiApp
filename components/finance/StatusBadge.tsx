import { Badge } from "@/components/ui/badge";

const variants: Record<string, string> = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  neutral: "bg-muted text-foreground"
};

export function StatusBadge({ status, label }: { status: keyof typeof variants | string; label?: string }) {
  const key = status in variants ? status : "neutral";
  return <Badge className={variants[key]}>{label ?? status}</Badge>;
}
