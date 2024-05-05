import { ImodulePermissions } from 'nest-starter/src/permissions/interface/modulePermissions';

export enum EpermissionPermissions {
  read = 'read',
  create = 'create',
  edit = 'edit',
  delete = 'delete',
}

export default class permissionPermissions implements ImodulePermissions {
  public module = 'permission';
  public actions = Object.values(EpermissionPermissions);
}
