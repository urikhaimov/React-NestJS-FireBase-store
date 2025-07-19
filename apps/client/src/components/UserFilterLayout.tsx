import React from 'react';
import ResponsiveDrawerWrapper from './ResponsiveDrawerFilterLayout';

export interface FilterLayoutProps {
  children: React.ReactNode;
  hasFilters?: boolean;
  onClear?: () => void;
  actions?: React.ReactNode;
}

export default function UserFilterLayout({
  children,
  hasFilters = false,
  actions,
  onClear,
}: FilterLayoutProps) {
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
