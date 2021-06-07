"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbSchema_1 = require("../../dbSchema");
exports.Column = (options) => (target, propertyKey) => {
    const dbSchema = dbSchema_1.DbSchema.getSchema();
    dbSchema.addField(target.constructor.name, propertyKey, Object.assign(Object.assign({}, options), { unique: options.unique === undefined ? false : options.unique, allowNull: options.allowNull === undefined ? true : options.allowNull, columnName: options.columnName === undefined ? propertyKey : options.columnName, isPrimaryKey: options.isPrimaryKey === undefined ? false : options.isPrimaryKey }));
};
exports.default = exports.Column;
