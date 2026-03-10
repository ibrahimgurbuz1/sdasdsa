'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Admin sayfalarını korumak için custom hook
 * Server-side session endpoint'i ile auth kontrol eder
 * Yoksa /admin/login'e yönlendirir
 */
export function useAdminAuth() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/admin/session', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        if (!response.ok && active) {
          router.replace('/admin/login');
        }
      } catch {
        if (active) {
          router.replace('/admin/login');
        }
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);
}
