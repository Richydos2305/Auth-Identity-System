import { BaseRepository } from './BaseRepository';
import { Tasks } from '../models/tasks';

export class TaskRepository extends BaseRepository<Tasks> {
    constructor() {
        super(Tasks);
    }
}
