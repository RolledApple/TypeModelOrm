"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbSchema_1 = require("../../dbSchema");
exports.ForeignKey = (targetModel, as) => (target, propertyKey) => {
    const dbSchema = dbSchema_1.DbSchema.getSchema();
    dbSchema.addRelation(target.constructor.name, targetModel().name, undefined, {
        as,
        sourceFk: propertyKey,
    });
    dbSchema.addRelation(targetModel().name, target.constructor.name, undefined, {
        as,
        inverseFk: propertyKey,
    });
};
