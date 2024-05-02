import { ImodulePermissions } from 'src/permissions/interface/modulePermissions';

export enum EmodulePermissions {
  read = 'read',
  create = 'create',
  edit = 'edit',
  delete = 'delete',
}

export default class modulePermissions implements ImodulePermissions {
  public module = 'module';
  public actions = Object.values(EmodulePermissions);
}
