type User = {
  permissions: string[];
  roles: string[];
};

type ValidateUserPermissionParams = {
  user: User;
  permissions: string[];
  roles: string[];
};

export function validateUserPermissions({
  user,
  permissions,
  roles,
}: ValidateUserPermissionParams) {
  if (permissions?.length > 0) {
    // Check if user has permissions
    const hasAllPermissions = permissions.every((permission) => {
      return user.permissions.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles?.length > 0) {
    // Check if user has one or more role
    const hasSomeRoles = roles.some((role) => {
      return user.roles.includes(role);
    });

    if (!hasSomeRoles) {
      return false;
    }
  }

  return true;
}
