import { PoolConfig } from "pg";
import { Model } from "../orm-definition/model";
import { Findable } from "./options/options";
export declare class Repository<M extends Model> {
    private _config;
    private _model;
    constructor(target: ModelTarget<M>, config: PoolConfig);
    findOne(options?: Findable<M['_modelProperties']>): Promise<M | undefined>;
    findAll(options?: Findable<M['_modelProperties']>): Promise<M[]>;
    create(values: M['_modelCreationProperties']): Promise<M>;
    update(values: Partial<M['_modelProperties']>, options?: Findable<M['_modelProperties']>): Promise<M[]>;
    delete(options?: Findable<M['_modelProperties']>): Promise<number>;
}
export declare type ObjectType<OT> = {
    new (): OT;
};
export declare type ModelTarget<M> = {
    new (): M;
};
