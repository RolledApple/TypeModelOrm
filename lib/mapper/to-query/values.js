"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbSchema_1 = require("../../dbSchema");
const dbSchema = dbSchema_1.DbSchema.getSchema();
exports.mapValuesToQuery = (valuesOptions, modelName) => {
    const fields = dbSchema.getModel(modelName).getFields();
    const values = Object.keys(valuesOptions)
        .reduce((acc, key) => acc.concat({
        column: fields[key].options.columnName,
        property: key,
        value: valuesOptions[key]
    }), []);
    return { values };
};
