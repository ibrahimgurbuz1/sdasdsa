'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Admin sayfalarını korumak için custom hook
 * localStorage'da adminAuth var mı kontrol eder
 * Yoksa /admin/login'e yönlendirir
 */
export function useAdminAuth() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      router.replace('/admin/login');
    }
  }, [router]);
}
