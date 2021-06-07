"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbSchema_1 = require("../../dbSchema");
const dbSchema = dbSchema_1.DbSchema.getSchema();
exports.mapInsertSqlToModel = (rows, modelName) => {
    const row = rows.find(_ => true);
    const fields = dbSchema.getModel(modelName).getFields();
    return Object.keys(fields)
        .reduce((acc, curr) => Object.assign(acc, { [curr]: row[fields[curr].options.columnName] }), {});
};
