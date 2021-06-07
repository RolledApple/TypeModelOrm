"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const helpers_1 = require("./helpers");
class Cursor {
    constructor(database, table, queryType) {
        this.database = database;
        this.table = table;
        this.queryType = queryType;
        this.cols = null;
        this.rows = null;
        this.rowCount = 0;
        this.ready = false;
        this.whereClause = '';
        this.joinClause = '';
        this.columns = ['*'];
        this.args = [];
        this.orderBy = undefined;
        this.columnName = '';
        this.insertClause = '';
        this.updateClause = '';
    }
    resolve(result) {
        const { rows, fields, rowCount } = result;
        this.rows = rows;
        this.cols = fields;
        this.rowCount = rowCount;
    }
    where(objClause) {
        if (!objClause)
            return this;
        const { clause, args } = helpers_1.where(objClause, this.table, this.args);
        this.whereClause = clause;
        this.args = args;
        return this;
    }
    columnsJoin(objClause) {
        if (!objClause)
            return this;
        const { columns, joinClause } = helpers_1.columnsJoin(objClause);
        console.log('joinClause: ', joinClause);
        this.columns = columns;
        this.joinClause = joinClause;
        return this;
    }
    skip(count) {
        this.offset = count;
        return this;
    }
    take(count) {
        this.limit = count;
        return this;
    }
    order(name) {
        this.orderBy = name;
        return this;
    }
    insertValues(queryStore) {
        if (!queryStore)
            return this;
        const { clause, args } = helpers_1.insert(queryStore);
        this.insertClause = clause;
        this.args = args;
        return this;
    }
    updateValues(queryStore) {
        if (!queryStore)
            return this;
        const { clause, args } = helpers_1.update(queryStore);
        this.updateClause = clause;
        this.args = args;
        return this;
    }
    buildQuery() {
        const { queryType, table, args } = this;
        let sql = '';
        if (queryType === "SELECT") {
            const { columns, whereClause, joinClause, offset, limit, } = this;
            const fields = columns.join(', ');
            sql += `SELECT ${fields} FROM "${table}"`;
            if (joinClause)
                sql += joinClause;
            if (whereClause)
                sql += `\nWHERE ${whereClause}`;
            if (offset)
                sql += `\nOFFSET ${offset}`;
            if (limit)
                sql += `\nLIMIT ${limit}`;
        }
        else if (queryType === "INSERT") {
            const { insertClause } = this;
            sql += `INSERT INTO "${table}"\n ${insertClause}`;
            sql += '\nRETURNING *';
        }
        else if (queryType === "UPDATE") {
            const { updateClause, whereClause } = this;
            sql += `UPDATE "${table}"\n ${updateClause}`;
            if (whereClause)
                sql += `\nWHERE ${whereClause}`;
            sql += '\nRETURNING *';
        }
        else if (queryType === "DELETE") {
            const { whereClause } = this;
            sql += `DELETE FROM "${table}"`;
            if (whereClause)
                sql += `\nWHERE ${whereClause}`;
        }
        return sql;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = this.buildQuery();
            try {
                const res = yield this.database.query(sql, this.args);
                this.resolve(res);
                const { rows, rowCount } = this;
                this.rowCount = rowCount;
                return rows;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
class Database {
    constructor(config) {
        this.pool = new pg_1.Pool(config);
        this.config = config;
    }
    query(sql, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            console.info('sql:', sql);
            console.info('values:', values);
            const res = yield this.pool.query(sql, values);
            const endTime = new Date().getTime();
            const executionTime = endTime - startTime;
            console.info(`Execution time(ms): ${executionTime}`);
            return res;
        });
    }
    select(table) {
        return new Cursor(this, table, "SELECT");
    }
    insert(table) {
        return new Cursor(this, table, "INSERT");
    }
    update(table) {
        return new Cursor(this, table, "UPDATE");
    }
    delete(table) {
        return new Cursor(this, table, "DELETE");
    }
    close() {
        this.pool.end();
    }
}
exports.default = {
    open: (config) => new Database(config),
};
