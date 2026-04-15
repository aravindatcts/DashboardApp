'use client';

import { Descope } from '@descope/nextjs-sdk';
import { useSession } from '@descope/nextjs-sdk/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './Login.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isSessionLoading } = useSession();

  useEffect(() => {
    if (!isSessionLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isSessionLoading, router]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoEmoji}>🇺🇸</span>
          <div>
            <div className={styles.logoMain}>America</div>
            <div className={styles.logoSub}>Health Insurance</div>
          </div>
        </div>

        <h1 className={styles.heading}>Sign in to your account</h1>
        <p className={styles.subheading}>Access your benefits, claims, and providers</p>

        <div className={styles.flowWrapper}>
          <Descope
            flowId="LoginFlow"
            onSuccess={() => router.replace('/dashboard')}
            onError={(e: unknown) => console.error('Descope login error:', e)}
          />
        </div>
      </div>
    </div>
  );
}
