import { Pool, PoolConfig } from 'pg';
import { WhereQueryStore } from '../mapper/to-query/where';
import { ValuesQueryStore } from '../mapper/to-query/values';
import { SelectJoinQueryStore } from '../mapper/to-query/select-join';
export declare type QueryType = "INSERT" | "SELECT" | "UPDATE" | "DELETE";
declare class Cursor {
    queryType: QueryType;
    ready: boolean;
    database: Database;
    table: string;
    cols: any;
    rows: any;
    rowCount: number;
    whereClause: string;
    columns: string[];
    joinClause: string;
    args: string[];
    offset?: number;
    limit?: number;
    orderBy: string | undefined;
    columnName: string;
    insertClause: string;
    updateClause: string;
    constructor(database: Database, table: string, queryType: QueryType);
    resolve(result: any): void;
    where(objClause?: WhereQueryStore): this;
    columnsJoin(objClause?: SelectJoinQueryStore): this;
    skip(count?: number): this;
    take(count?: number): this;
    order(name: string): this;
    insertValues(queryStore?: ValuesQueryStore): this;
    updateValues(queryStore: ValuesQueryStore): this;
    private buildQuery;
    execute(): Promise<any>;
}
declare class Database {
    pool: Pool;
    config: PoolConfig;
    constructor(config: PoolConfig);
    query(sql: string, values: any[]): Promise<import("pg").QueryResult<any>>;
    select(table: string): Cursor;
    insert(table: string): Cursor;
    update(table: string): Cursor;
    delete(table: string): Cursor;
    close(): void;
}
declare const _default: {
    open: (config: PoolConfig) => Database;
};
export default _default;
