import { ImodulePermissions } from 'nest-starter/src/permissions/interface/modulePermissions';

export enum EnotificationPermissions {
  read = 'read',
  create = 'create',
  edit = 'edit',
  delete = 'delete',
}

export default class notificationPermissions implements ImodulePermissions {
  public module = 'notification';
  public actions = Object.values(EnotificationPermissions);
}
