'use client';

import { useState, useEffect } from 'react';
import { checkIsAdmin } from '@/lib/admin';

interface UseIsAdminOptions {
  user: { email?: string | null } | null;
}

/**
 * Hook that checks if the current user is an admin by querying the admins table.
 * Returns { isAdmin, loading }.
 */
export function useIsAdmin({ user }: UseIsAdminOptions): { isAdmin: boolean; loading: boolean } {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function run() {
      setLoading(true);
      const result = await checkIsAdmin(user?.email ?? null);
      if (!cancelled) {
        setIsAdmin(result);
      }
      if (!cancelled) {
        setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  return { isAdmin, loading };
}
