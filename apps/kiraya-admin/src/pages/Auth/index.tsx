import React from 'react';
import { SpinnerIcon } from '@kiraya/kiraya-ui';
import { Navigate, Outlet } from 'react-router-dom';
import { useSigninCheck } from 'reactfire';
import LoginPage from './Login';
import ForgotPasswordPage from './ForgotPassword';

function ProtectedRoute({
  redirectTo = '/',
  children,
  redirectBack,
}: {
  redirectTo?: string;
  children?: React.ReactNode;
  redirectBack?: boolean;
}) {
  const { status, data: signInCheckResult } = useSigninCheck();
  if (status === 'loading') {
    return (
      <span>
        <SpinnerIcon /> Auth Check...
      </span>
    );
  }
  if (signInCheckResult.signedIn === true) {
    return <>{children || <Outlet />}</>;
  }
  return <Navigate to={`${redirectTo}login`} replace />;
}

export { LoginPage, ProtectedRoute, ForgotPasswordPage };
