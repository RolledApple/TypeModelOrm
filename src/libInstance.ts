import { PoolConfig } from "pg"
import { Model } from "./orm-definition/model"
import { ModelTarget, Repository } from "./repository/repository"

export default class TypeModelOrm {
    constructor(config: PoolConfig) {
        this.config = config
    }
    public config: PoolConfig

    public addModels(models: ModelTarget<Model>[]) {
        for (const model of models) {
            console.log(model.prototype)
        }
    }

    public getRepository<M extends Model>(target: ModelTarget<M>): Repository<M> {
        return new Repository<M>(target, this.config)
    }
}