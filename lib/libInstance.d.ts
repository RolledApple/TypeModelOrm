import { PoolConfig } from "pg";
import { Model } from "./orm-definition/model";
import { ModelTarget, Repository } from "./repository/repository";
export default class TypeModelOrm {
    constructor(config: PoolConfig);
    config: PoolConfig;
    addModels(models: ModelTarget<Model>[]): void;
    getRepository<M extends Model>(target: ModelTarget<M>): Repository<M>;
}
