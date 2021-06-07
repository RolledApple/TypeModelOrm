"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("../../utils");
const operators_1 = require("../../repository/options/operators");
const dbSchema_1 = require("../../dbSchema");
const dbSchema = dbSchema_1.DbSchema.getSchema();
const createCondition = (fields, query, propKey) => {
    const column = fields[propKey].options.columnName;
    if (utils.isPrimitive(query)) {
        return {
            column,
            comparisonOperator: "=",
            value: query,
        };
    }
    else {
        const gt = query[operators_1.default.gt];
        if (gt)
            return {
                column,
                value: query[operators_1.default.gt],
                comparisonOperator: operators_1.default.asSql(operators_1.default.gt),
            };
        const gte = query[operators_1.default.gte];
        if (gte)
            return {
                column,
                value: query[operators_1.default.gte],
                comparisonOperator: operators_1.default.asSql(operators_1.default.gte),
            };
        const lt = query[operators_1.default.lt];
        if (lt)
            return {
                column,
                value: query[operators_1.default.lt],
                comparisonOperator: operators_1.default.asSql(operators_1.default.lt),
            };
        const lte = query[operators_1.default.lte];
        if (lte)
            return {
                column,
                value: query[operators_1.default.lte],
                comparisonOperator: operators_1.default.asSql(operators_1.default.lte),
            };
        const neq = query[operators_1.default.neq];
        if (neq)
            return {
                column,
                value: query[operators_1.default.neq],
                comparisonOperator: operators_1.default.asSql(operators_1.default.neq),
            };
        const like = query[operators_1.default.like];
        const kek = 'asdf';
        if (like)
            return {
                column,
                value: query[operators_1.default.like].replace(/\*/g, '%').replace(/\?/g, '_'),
                comparisonOperator: operators_1.default.asSql(operators_1.default.like),
            };
    }
};
const createLogicsubQuery = (fields) => (query, logicOperator) => {
    const properyKeys = Object.getOwnPropertyNames(query);
    const operatorKeys = Object.getOwnPropertySymbols(query);
    const initializedFunc = createLogicsubQuery(fields);
    return {
        logicOperator,
        conditions: properyKeys.map(key => createCondition(fields, query[key], key)),
        subClauses: operatorKeys.map(key => initializedFunc(query[key], operators_1.default.asSql(key)))
    };
};
exports.mapWhereOptionsToQuery = (options, modelName) => {
    if (!options || !options.where)
        return undefined;
    const modelFields = dbSchema.getModel(modelName).getFields();
    const rootPropertyKeys = Object.getOwnPropertyNames(options.where);
    const rootOperatorKeys = Object.getOwnPropertySymbols(options.where);
    const [rootLogicOperator, rootQuery] = rootPropertyKeys.length !== 0 || rootOperatorKeys.length > 1 ? ['AND', options.where]
        : [operators_1.default.asSql(rootOperatorKeys[0]), options.where[rootOperatorKeys[0]]];
    const whereClause = createLogicsubQuery(modelFields)(rootQuery, rootLogicOperator);
    return whereClause;
};
