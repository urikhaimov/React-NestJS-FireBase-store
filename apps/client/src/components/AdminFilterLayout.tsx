import React from 'react';
import ResponsiveDrawerWrapper from './ResponsiveDrawerFilterLayout';

export interface AdminFilterLayoutProps {
  children: React.ReactNode;
  hasFilters?: boolean;
  onClear?: () => void;
  actions?: React.ReactNode;
}

export default function AdminFilterLayout({
  children,
  hasFilters = false,
  actions,
  onClear,
}: AdminFilterLayoutProps) {
  return (
    <ResponsiveDrawerWrapper
      hasFilters={hasFilters}
      actions={actions}
      onClear={onClear}
    >
      {children}
    </ResponsiveDrawerWrapper>
  );
}
