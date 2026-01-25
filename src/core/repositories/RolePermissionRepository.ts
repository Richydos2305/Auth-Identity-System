import { BaseRepository } from './BaseRepository';
import { RolePermissions } from '../models/rolePermissions';

export class RolePermissionRepository extends BaseRepository<RolePermissions> {
    constructor() {
        super(RolePermissions);
    }
}
