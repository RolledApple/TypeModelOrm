"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbSchema_1 = require("../../dbSchema");
exports.ManyToOne = (targetModel, relationProperty, inverseFk, as) => (target, propertyKey) => {
    const dbSchema = dbSchema_1.DbSchema.getSchema();
    dbSchema.addRelation(target.constructor.name, targetModel().name, {
        as,
        relationType: 'many-to-one',
        inverseProperty: relationProperty,
        sourceProperty: propertyKey,
        inverseFk: inverseFk ? inverseFk : 'id',
    });
    dbSchema.addRelation(targetModel().name, target.constructor.name, {
        as,
        relationType: 'one-to-many',
        inverseProperty: propertyKey,
        sourceProperty: relationProperty,
        sourceFk: inverseFk ? inverseFk : 'id',
    });
};
