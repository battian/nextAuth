import { useAuth } from '../contexts/AuthContext';
import { validateUserPermissions } from '../utils/validateUserPermission';

type useCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: useCanParams) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  return validateUserPermissions({
    user,
    permissions,
    roles,
  });
}
