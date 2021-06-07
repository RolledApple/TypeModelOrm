"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbSchema_1 = require("../../dbSchema");
const dbSchema = dbSchema_1.DbSchema.getSchema();
exports.mapNonJoinSqlRowsToModel = (rows, modelName) => {
    const fields = dbSchema.getModel(modelName).getFields();
    return rows.map(row => Object.keys(fields)
        .reduce((acc, curr) => Object.assign(acc, { [curr]: row[fields[curr].options.columnName] }), {}));
};
