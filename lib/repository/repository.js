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
const db_1 = require("../sql-builder/db");
const values_1 = require("../mapper/to-query/values");
const insert_1 = require("../mapper/to-model/insert");
const where_1 = require("../mapper/to-query/where");
const join_row_1 = require("../mapper/to-model/join-row");
const select_join_1 = require("../mapper/to-query/select-join");
const non_join_rows_1 = require("../mapper/to-model/non-join-rows");
class Repository {
    constructor(target, config) {
        this._model = target;
        this._config = config;
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileAlloptions = Object.assign(Object.assign({}, options), { take: 1 });
            const result = yield this.findAll(fileAlloptions);
            return result.find(_ => true);
        });
    }
    findAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereClause = where_1.mapWhereOptionsToQuery(options, this._model.name);
            const tableClause = select_join_1.mapFindOptionsToQuery(options, this._model.name);
            const sql = db_1.default.open(this._config);
            const query = sql
                .select(this._model.name)
                .where(whereClause)
                .columnsJoin(tableClause)
                .skip(options.skip)
                .take(options.take);
            const rows = yield query
                .execute();
            sql.close();
            const result = join_row_1.mapJoinSqlRowsToModel(rows, tableClause);
            console.log('resModel', result);
            return result;
        });
    }
    create(values) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryStore = values_1.mapValuesToQuery(values, this._model.name);
            const sql = db_1.default.open(this._config);
            const query = sql
                .insert(this._model.name)
                .insertValues(queryStore);
            const rows = yield query
                .execute();
            sql.close();
            const result = insert_1.mapInsertSqlToModel(rows, this._model.name);
            console.log('create res', result);
            return result;
        });
    }
    update(values, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const valuesQueryStore = values_1.mapValuesToQuery(values, this._model.name);
            const whereQueryStore = where_1.mapWhereOptionsToQuery(options, this._model.name);
            const sql = db_1.default.open(this._config);
            const query = sql
                .update(this._model.name)
                .updateValues(valuesQueryStore)
                .where(whereQueryStore);
            const rows = yield query
                .execute();
            sql.close();
            const result = non_join_rows_1.mapNonJoinSqlRowsToModel(rows, this._model.name);
            console.log('update res: ', result);
            return result;
        });
    }
    delete(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereQueryStore = where_1.mapWhereOptionsToQuery(options, this._model.name);
            const sql = db_1.default.open(this._config);
            const query = sql
                .delete(this._model.name)
                .where(whereQueryStore);
            const rows = yield query
                .execute();
            sql.close();
            console.log('delete res', query.rowCount);
            return query.rowCount;
        });
    }
}
exports.Repository = Repository;
