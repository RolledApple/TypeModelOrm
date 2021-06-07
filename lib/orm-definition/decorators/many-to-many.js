"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbSchema_1 = require("../../dbSchema");
exports.ManyToMany = (relatedOptions, throughOptions, as) => (target, propertyKey) => {
    const dbSchema = dbSchema_1.DbSchema.getSchema();
    dbSchema.addRelation(target.constructor.name, relatedOptions.model().name, {
        as,
        throughOptions: {
            model: throughOptions.model().name,
            sourceKey: throughOptions.inverseKey,
            inverseKey: throughOptions.sourceKey,
        },
        relationType: 'many-to-many',
        inverseProperty: relatedOptions.property,
        sourceProperty: propertyKey,
    });
    dbSchema.addRelation(relatedOptions.model().name, target.constructor.name, {
        as,
        throughOptions: {
            model: throughOptions.model().name,
            sourceKey: throughOptions.sourceKey,
            inverseKey: throughOptions.inverseKey,
        },
        relationType: 'many-to-many',
        inverseProperty: propertyKey,
        sourceProperty: relatedOptions.property,
    });
};
