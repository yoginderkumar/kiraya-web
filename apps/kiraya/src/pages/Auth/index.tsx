import React from 'react';
import { SpinnerIcon } from '@kiraya/kiraya-ui';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSigninCheck } from 'reactfire';
import LoginPage from './Login';
import SignUpPage from './Signup';
import { queryToSearch } from '@kiraya/util-general';

function UserNotLoggedIn({
  redirectTo = '/',
  children,
  redirectBack,
}: {
  redirectTo?: string;
  children?: React.ReactNode;
  redirectBack?: boolean;
}) {
  const { status, data: signInCheckResult } = useSigninCheck();
  const location = useLocation();
  if (status === 'loading') {
    return (
      <span>
        <SpinnerIcon /> Authorization...
      </span>
    );
  }
  if (signInCheckResult.signedIn === false) {
    return <>{children || <Outlet />}</>;
  }
  return (
    <Navigate
      to={`${redirectTo}${queryToSearch(
        redirectBack
          ? {
              next: location.pathname + location.search,
            }
          : {}
      )}`}
      replace
    />
  );
}

export { LoginPage, SignUpPage, UserNotLoggedIn };
