import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';
export const Permissions = (
  permissions: { module: string; action: string; allowOwn?: boolean }[],
) => SetMetadata(PERMISSION_KEY, permissions);
