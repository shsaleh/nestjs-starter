import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => {
  return (
    target: Record<string, any>,
    key: string,
    descriptor: PropertyDescriptor,
  ) => {
    SetMetadata('swagger/apiSecurity', ['public'])(target, key, descriptor);
    SetMetadata(IS_PUBLIC_KEY, true)(target, key, descriptor);
  };
};
