export type CsvRow = Record<string, string>;

export const defaultColumnMapping = {
  date: "fecha",
  amount: "monto",
  description: "descripcion",
  account: "cuenta"
};

export function parseCsv(content: string): CsvRow[] {
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return headers.reduce<CsvRow>((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});
  });
}

export function autoCategorize(text: string): string {
  const normalized = text.toUpperCase();
  if (normalized.includes("GOOGLE") || normalized.includes("CHAT GPT") || normalized.includes("CHATGPT")) {
    return "Suscripciones digitales";
  }
  if (normalized.includes("UBER") || normalized.includes("SUBE") || normalized.includes("TAXI")) {
    return "Transporte";
  }
  if (normalized.includes("SUPERMERCADO")) {
    return "Alimentación hogar";
  }
  return "Supermercado";
}

export function detectDuplicates(rows: CsvRow[], mapping: Record<string, string>) {
  const seen = new Set<string>();
  return rows.map((row) => {
    const signature = [row[mapping.date], row[mapping.amount], row[mapping.description], row[mapping.account]].join("|");
    const duplicated = seen.has(signature);
    seen.add(signature);
    return { row, signature, duplicated };
  });
}

export function validateRow(row: CsvRow, mapping: Record<string, string>) {
  const errors: string[] = [];
  if (!row[mapping.date]) errors.push("Fecha requerida");
  if (!row[mapping.amount] || Number.isNaN(Number(row[mapping.amount]))) errors.push("Monto inválido");
  if (!row[mapping.description]) errors.push("Descripción requerida");
  if (!row[mapping.account]) errors.push("Cuenta requerida");
  return errors;
}
