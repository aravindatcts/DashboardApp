'use client';

import { AuthProvider } from '@descope/nextjs-sdk';
import type { ReactNode } from 'react';

export default function DescopeProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID!}>
      {children}
    </AuthProvider>
  );
}
