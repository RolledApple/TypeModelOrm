"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbSchema_1 = require("../../dbSchema");
exports.OneToOne = (targetModel, relationProperty, as) => (target, propertyKey) => {
    const dbSchema = dbSchema_1.DbSchema.getSchema();
    dbSchema.addRelation(target.constructor.name, targetModel().name, {
        as,
        relationType: 'one-to-one',
        inverseProperty: relationProperty,
        sourceProperty: propertyKey,
    });
    dbSchema.addRelation(targetModel().name, target.constructor.name, {
        as,
        relationType: 'one-to-one',
        inverseProperty: propertyKey,
        sourceProperty: relationProperty,
    });
};
