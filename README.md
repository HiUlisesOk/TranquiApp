# TranquiApp

App de finanzas personales con Next.js + Supabase.

## Instalación

```bash
npm install
cp .env.example .env.local
```

Completa `.env.local` con tus credenciales de Supabase.

## Ejecución local

```bash
npm run dev
```

La app queda disponible en `http://localhost:3000`.

## Migraciones SQL en Supabase

1. Abre **Supabase Dashboard → SQL Editor**.
2. Ejecuta el contenido de `supabase/migrations/20260326090000_finance_schema.sql`.

Esto crea tablas, relaciones y políticas necesarias.

## Seed

En el mismo SQL Editor, ejecuta `supabase/seed.sql` para cargar datos iniciales.

## Flujo de autenticación

- Si `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` existen, la app usa Supabase Auth.
- En servidor se lee el token `sb-access-token` para consultas autenticadas.
- Rutas protegidas redirigen a `/login` cuando no hay sesión.

## Notas sobre datos demo / fallback

- Si faltan variables de entorno, la app entra en **modo demo** automáticamente.
- En modo demo se usa un usuario local (`demo@tranqui.app`) y datos mock para permitir explorar UI sin backend.

## Scripts

- `npm run dev`: desarrollo local.
- `npm run lint`: lint con Next.js ESLint.
- `npm run typecheck`: validación de tipos TypeScript.
- `npm run build`: build de producción.

## Despliegue en Vercel

1. Importa el repo en Vercel.
2. En **Project Settings → Environment Variables**, crea:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Ejecuta migraciones y seed en Supabase (SQL Editor) antes del primer release.
4. Haz deploy (`main` o rama configurada).

Sugerencia: replica las mismas variables en `Preview` y `Production` para evitar diferencias de comportamiento.
