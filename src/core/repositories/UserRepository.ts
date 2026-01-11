import { BaseRepository } from './BaseRepository';
import { Users } from '../models/users';

export class UserRepository extends BaseRepository<Users> {
    constructor() {
        super(Users);
    }
}
