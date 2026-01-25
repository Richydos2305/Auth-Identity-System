import { Model, ModelStatic, WhereOptions, Transaction, CreationAttributes, FindOptions } from 'sequelize';

export abstract class BaseRepository<T extends Model> {
    protected model: ModelStatic<T>;

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    async find(where: WhereOptions<T>, transaction?: Transaction, exclusiveLock = false): Promise<T | null> {
        return await this.model.findOne({ where, transaction, lock: exclusiveLock ? Transaction?.LOCK.UPDATE : !!transaction });
    }

    async findAll(where?: WhereOptions<T>, transaction?: Transaction, options?: Omit<FindOptions<T>, 'where' | 'transaction'>): Promise<T[]> {
        return await this.model.findAll({ where, transaction, ...options });
    }

    async create(data: CreationAttributes<T>, transaction?: Transaction): Promise<T> {
        return await this.model.create(data, { transaction });
    }

    async update(where: WhereOptions<T>, data: Partial<CreationAttributes<T>>, transaction?: Transaction): Promise<[number, T[]]> {
        if (transaction) {
            // To exclusively lock the rows being updated
            await this.find(where, transaction, true);
        }
        return await this.model.update(data, {
            where,
            returning: true,
            transaction
        });
    }

    async delete(where: WhereOptions<T>, transaction?: Transaction): Promise<number> {
        return await this.model.destroy({ where, transaction });
    }
}
