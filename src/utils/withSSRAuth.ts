import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import decode from 'jwt-decode';

import { AuthTokenError } from '../errors/AuthTokenError';
import { validateUserPermissions } from './validateUserPermission';

type WithSSRAuthOptions = {
  permissions?: string[];
  roles?: string[];
};

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptions) {
  // HOR (High Order Function) - Funcion that returns another function
  return async (
    context: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context);
    const token = cookies['nextauth.token'];

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const user =
      decode<{
        permissions: string[];
        roles: string[];
      }>(token);

    if (options) {
      const { permissions, roles } = options;
      const userHasValidPermissions = validateUserPermissions({
        permissions,
        roles,
        user,
      });

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/dashboard', // Redirect to a page that every user has access
            permanent: false,
          },
        };
      }
    }

    try {
      return await fn(context);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(context, 'nextauth.token');
        destroyCookie(context, 'nextauth.refreshToken');

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }
  };
}
