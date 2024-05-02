import { ImodulePermissions } from 'src/permissions/interface/modulePermissions';

export enum EuserPermissions {
  read = 'read',
  create = 'create',
  edit = 'edit',
  delete = 'delete',
}

export default class userPermissions implements ImodulePermissions {
  public module = 'user';
  public actions = Object.values(EuserPermissions);
}
