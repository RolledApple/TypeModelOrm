import { PoolConfig } from "pg"
import sqlBuilder from '../sql-builder/db'
import { Model } from "../orm-definition/model"
import { Findable } from "./options/options"
import { mapValuesToQuery } from "../mapper/to-query/values"
import { mapInsertSqlToModel } from "../mapper/to-model/insert"
import { mapWhereOptionsToQuery } from "../mapper/to-query/where"
import { mapJoinSqlRowsToModel } from "../mapper/to-model/join-row"
import { mapFindOptionsToQuery } from "../mapper/to-query/select-join"
import { mapNonJoinSqlRowsToModel } from "../mapper/to-model/non-join-rows"

export class Repository<M extends Model> {
    private _config: PoolConfig
    private _model: ModelTarget<M>
    constructor(target: ModelTarget<M>, config: PoolConfig) {
        this._model = target
        this._config = config
    }

    public async findOne(
        options?: Findable<M['_modelProperties']>
    ): Promise<M | undefined> {
        const fileAlloptions = {
            ...options,
            take: 1
        }
        const result = await this.findAll(fileAlloptions)
        return result.find(_ => true)
    }

    public async findAll(
        options?: Findable<M['_modelProperties']>
    ): Promise<M[]> {
        const whereClause = mapWhereOptionsToQuery(options, this._model.name)
        const tableClause = mapFindOptionsToQuery(
            options,
            this._model.name
        )
        const sql = sqlBuilder.open(this._config)
        const query = sql
            .select(this._model.name)
            .where(whereClause)
            .columnsJoin(tableClause)
            .skip(options!.skip)
            .take(options!.take)

        const rows = await query
            .execute() as Array<any>

        sql.close()

        const result = mapJoinSqlRowsToModel(rows, tableClause)
        console.log('resModel', result)
        return result as M[]
    }

    public async create(
        values: M['_modelCreationProperties']
    ): Promise<M> {
        const queryStore = mapValuesToQuery(values, this._model.name)
        const sql = sqlBuilder.open(this._config)
        const query = sql
            .insert(this._model.name)
            .insertValues(queryStore)

        const rows = await query
            .execute() as Array<any>
        sql.close()

        const result = mapInsertSqlToModel(rows, this._model.name)
        console.log('create res', result)
        return result as M
    }

    public async update(
        values: Partial<M['_modelProperties']>,
        options?: Findable<M['_modelProperties']>
    ): Promise<M[]> {
        const valuesQueryStore = mapValuesToQuery(values, this._model.name)
        const whereQueryStore = mapWhereOptionsToQuery(options, this._model.name)
        const sql = sqlBuilder.open(this._config)
        const query = sql
            .update(this._model.name)
            .updateValues(valuesQueryStore)
            .where(whereQueryStore)

        const rows = await query
            .execute() as Array<any>
        sql.close()

        const result = mapNonJoinSqlRowsToModel(rows, this._model.name)
        console.log('update res: ', result)
        return result as M[]
    }

    public async delete(
        options?: Findable<M['_modelProperties']>
    ): Promise<number> {
        const whereQueryStore = mapWhereOptionsToQuery(options, this._model.name)
        const sql = sqlBuilder.open(this._config)
        const query = sql
            .delete(this._model.name)
            .where(whereQueryStore)

        const rows = await query
            .execute() as Array<any>
        sql.close()
        
        console.log('delete res', query.rowCount)
        return query.rowCount
    }
}

export type ObjectType<OT> = { new(): OT }

export type ModelTarget<M> = { new(): M }
