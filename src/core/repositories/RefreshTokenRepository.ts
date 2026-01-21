import { BaseRepository } from './BaseRepository';
import { RefreshTokens } from '../models/refreshTokens';

export class RefreshTokenRepository extends BaseRepository<RefreshTokens> {
    constructor() {
        super(RefreshTokens);
    }
}
