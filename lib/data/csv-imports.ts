import { getSupabaseServerClient } from '../supabase/server';
import { withDemoFallback } from './base';
import { demoCsvImports } from './demo';
import type { CsvImport } from './types';

export async function listCsvImports(profileId: string): Promise<CsvImport[]> {
  return withDemoFallback(
    async () => {
      const supabase = getSupabaseServerClient();
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('csv_imports')
        .select('id, profile_id, file_name, status, rows_total, rows_imported, error_message, created_at')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data ?? []).map(
        (row) =>
          ({
            id: row.id,
            profileId: row.profile_id,
            fileName: row.file_name,
            status: row.status,
            rowsTotal: row.rows_total,
            rowsImported: row.rows_imported,
            errorMessage: row.error_message,
            createdAt: row.created_at,
          }) satisfies CsvImport,
      );
    },
    () => demoCsvImports.filter((i) => i.profileId === profileId),
  );
}
