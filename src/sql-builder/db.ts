import { Pool, PoolConfig } from 'pg'
import { WhereQueryStore } from '../mapper/to-query/where'
import { ValuesQueryStore } from '../mapper/to-query/values'
import { columnsJoin, insert, update, where } from './helpers'
import { SelectJoinQueryStore } from '../mapper/to-query/select-join'

export type QueryType = "INSERT" | "SELECT" | "UPDATE" | "DELETE"
class Cursor {
    queryType: QueryType
    ready: boolean
    database: Database
    table: string
    cols: any
    rows: any
    rowCount: number
    whereClause: string
    columns: string[]
    joinClause: string
    args: string[]
    offset?: number
    limit?: number
    orderBy: string | undefined
    columnName: string
    insertClause: string
    updateClause: string
    constructor(database: Database, table: string, queryType: QueryType) {
        this.database = database
        this.table = table
        this.queryType = queryType
        this.cols = null
        this.rows = null
        this.rowCount = 0
        this.ready = false
        this.whereClause = ''
        this.joinClause = ''
        this.columns = ['*']
        this.args = []
        this.orderBy = undefined
        this.columnName = ''
        this.insertClause = ''
        this.updateClause = ''
    }

    resolve(result: any) {
        const { rows, fields, rowCount } = result
        this.rows = rows
        this.cols = fields
        this.rowCount = rowCount
    }

    where(objClause?: WhereQueryStore) {
        if (!objClause) return this
        const { clause, args } = where(objClause, this.table, this.args)
        this.whereClause = clause
        this.args = args
        return this
    }

    columnsJoin(objClause?: SelectJoinQueryStore) {
        if (!objClause) return this
        const { columns, joinClause } = columnsJoin(objClause)
        console.log('joinClause: ', joinClause)
        this.columns = columns
        this.joinClause = joinClause
        return this
    }

    skip(count?: number) {
        this.offset = count
        return this
    }

    take(count?: number) {
        this.limit = count
        return this
    }

    order(name: string) {
        this.orderBy = name
        return this
    }

    insertValues(queryStore?: ValuesQueryStore) {
        if (!queryStore) return this
        const { clause, args } = insert(queryStore)
        this.insertClause = clause
        this.args = args
        return this
    }

    updateValues(queryStore: ValuesQueryStore) {
        if (!queryStore) return this
        const { clause, args } = update(queryStore)
        this.updateClause = clause
        this.args = args
        return this
    }

    private buildQuery() {
        const { queryType, table, args } = this
        let sql = ''
        if (queryType === "SELECT") {
            const { columns, whereClause, joinClause, offset, limit, } = this
            const fields = columns.join(', ')
            sql += `SELECT ${fields} FROM "${table}"`
            if (joinClause) sql += joinClause
            if (whereClause) sql += `\nWHERE ${whereClause}`
            if (offset) sql += `\nOFFSET ${offset}`
            if (limit) sql += `\nLIMIT ${limit}`
        } else if (queryType === "INSERT") {
            const { insertClause } = this
            sql += `INSERT INTO "${table}"\n ${insertClause}`
            sql += '\nRETURNING *'
        } else if (queryType === "UPDATE") {
            const { updateClause, whereClause } = this
            sql += `UPDATE "${table}"\n ${updateClause}`
            if (whereClause) sql += `\nWHERE ${whereClause}`
            sql += '\nRETURNING *'
        } else if (queryType === "DELETE") {
            const { whereClause } = this
            sql += `DELETE FROM "${table}"`
            if (whereClause) sql += `\nWHERE ${whereClause}`
        }
        return sql
    }

    async execute() {
        const sql = this.buildQuery()
        try {
            const res = await this.database.query(sql, this.args)

            this.resolve(res)
            const { rows, rowCount } = this
            this.rowCount = rowCount
            return rows
        } catch (error) {
            throw new Error(error)
        }
    }
}

class Database {
    pool: Pool
    config: PoolConfig
    constructor(config: PoolConfig) {
        this.pool = new Pool(config)
        this.config = config
    }

    async query(sql: string, values: any[]) {
        const startTime = new Date().getTime()
        console.info('sql:', sql)
        console.info('values:', values)
        const res = await this.pool.query(sql, values)
        const endTime = new Date().getTime()
        const executionTime = endTime - startTime
        console.info(`Execution time(ms): ${executionTime}`)
        return res
    }

    select(table: string) {
        return new Cursor(this, table, "SELECT")
    }

    insert(table: string) {
        return new Cursor(this, table, "INSERT")
    }

    update(table: string) {
        return new Cursor(this, table, "UPDATE")
    }

    delete(table: string) {
        return new Cursor(this, table, "DELETE")
    }

    close() {
        this.pool.end()
    }
}

export default {
    open: (config: PoolConfig) => new Database(config),
}