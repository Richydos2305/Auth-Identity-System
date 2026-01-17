import { BaseRepository } from './BaseRepository';
import { Roles } from '../models/roles';

export class RoleRepository extends BaseRepository<Roles> {
    constructor() {
        super(Roles);
    }

    async getDefaultUserRole(): Promise<Roles | null> {
        return await this.find({ name: 'USER' });
    }
}
