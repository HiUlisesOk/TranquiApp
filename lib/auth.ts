import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { getSupabaseServerClient } from './supabase/server';

export type AppSession = {
  user: User | null;
  isAuthenticated: boolean;
  isDemo: boolean;
};

const demoUser: Partial<User> = {
  id: 'demo-user',
  email: 'demo@tranqui.app',
};

export async function getAppSession(): Promise<AppSession> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return {
      user: demoUser as User,
      isAuthenticated: true,
      isDemo: true,
    };
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user ?? null;

  return {
    user,
    isAuthenticated: Boolean(user),
    isDemo: false,
  };
}

export async function requireUser(options?: { redirectTo?: string }): Promise<User> {
  const session = await getAppSession();

  if (!session.user) {
    redirect(options?.redirectTo ?? '/login');
  }

  return session.user;
}

export async function requireAnonymous(options?: { redirectTo?: string }): Promise<void> {
  const session = await getAppSession();

  if (session.user) {
    redirect(options?.redirectTo ?? '/');
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getAppSession();
  return session.isAuthenticated;
}

export function withRouteGuard<TArgs extends unknown[], TResult>(
  guard: (...args: TArgs) => Promise<void>,
  handler: (...args: TArgs) => Promise<TResult>,
) {
  return async (...args: TArgs): Promise<TResult> => {
    await guard(...args);
    return handler(...args);
  };
}
