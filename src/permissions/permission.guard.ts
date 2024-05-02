import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from './permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      {
        module: string;
        action: string;
        allowOwn?: boolean; // Optional property to check ownership
      }[]
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    const req = context.switchToHttp().getRequest();

    if (!requiredPermissions) {
      return true; // No permissions required, access granted
    }

    const userPermissions: {
      module: string;
      action: string;
    }[] = [];
    req.user.Roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        userPermissions.push({
          module: permission.module.name,
          action: permission.action,
        });
      });
    });

    const hasPermission = requiredPermissions.some((requiredPermission) => {
      // Check if the user has the necessary module and action permissions
      const permissionGranted = userPermissions.some(
        (userPermission) =>
          userPermission.module === requiredPermission.module &&
          userPermission.action === requiredPermission.action,
      );

      if (permissionGranted) {
        return permissionGranted;
      } else if (requiredPermission.allowOwn) {
        req.allowOwn = true;
        return true;
      }

      return permissionGranted;
    });

    return hasPermission;
  }
}
