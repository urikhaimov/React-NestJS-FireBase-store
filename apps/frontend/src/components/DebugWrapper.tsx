import React, { ReactNode } from 'react';
import { useAuthSafe } from '../hooks/useAuthSafe';

export const DebugWrapper = ({ label, children }: { label: string; children: ReactNode }) => {
  try {
    const auth = useAuthSafe();
    console.log(`[DebugWrapper:${label}]`, { auth });
    return <>{children}</>;
  } catch (err) {
    console.error(`[DebugWrapper:${label}] ERROR:`, err);
    return <div style={{ color: 'red' }}>⚠ Error in {label}: {err instanceof Error ? err.message : String(err)}</div>;
  }
};
