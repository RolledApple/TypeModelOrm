"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbSchema_1 = require("../../dbSchema");
const Table = (options) => (target) => {
    const dbSchema = dbSchema_1.DbSchema.getSchema();
    dbSchema.addModel(target.name, options);
};
exports.default = Table;
