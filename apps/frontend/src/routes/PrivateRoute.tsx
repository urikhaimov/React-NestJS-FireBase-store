import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useSafeAuth } from '../hooks/getSafeAuth';
interface Props {
   children: ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { user } = useSafeAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
