import { ImodulePermissions } from 'nest-starter/src/permissions/interface/modulePermissions';

export enum ErolePermissions {
  read = 'read',
  create = 'create',
  edit = 'edit',
  delete = 'delete',
}

export default class rolePermissions implements ImodulePermissions {
  public module = 'role';
  public actions = Object.values(ErolePermissions);
}
