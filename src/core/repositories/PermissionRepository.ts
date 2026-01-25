import { BaseRepository } from './BaseRepository';
import { Permissions } from '../models/permissions';

export class PermissionRepository extends BaseRepository<Permissions> {
    constructor() {
        super(Permissions);
    }
}
