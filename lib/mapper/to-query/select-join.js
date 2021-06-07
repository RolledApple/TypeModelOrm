"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const dbSchema_1 = require("../../dbSchema");
const dbSchema = dbSchema_1.DbSchema.getSchema();
exports.mapFindOptionsToQuery = (query, modelName) => {
    var _a, _b;
    const model = dbSchema.getModel(modelName);
    const attributeKeys = query['attributes'];
    const includes = query['include'];
    const properties = Object.keys(model.getFields());
    const primaryKey = properties
        .filter(key => model.getFields()[key].options.isPrimaryKey === true)
        .find(_ => true);
    const tableName = (_a = model.options) === null || _a === void 0 ? void 0 : _a.tableName;
    const props = !attributeKeys ? properties
        : attributeKeys.include ? attributeKeys.include
            : properties.filter(x => attributeKeys.exclude.includes(x));
    if (!props.includes(primaryKey))
        props.push(primaryKey);
    const attributes = props.map((key) => {
        var _a;
        const column = model.getFields()[key].options.columnName;
        return {
            isPk: key === primaryKey,
            propKey: key,
            column,
            as: `${(_a = model.options) === null || _a === void 0 ? void 0 : _a.tableName}_${column}_${uuid_1.v4()}`
        };
    });
    const joins = (_b = includes) === null || _b === void 0 ? void 0 : _b.map(join => {
        var _a, _b;
        const relationOptions = model.getRelations()[join.model.name];
        return {
            options: Object.assign(Object.assign({}, relationOptions), { through: relationOptions.throughOptions ? Object.assign(Object.assign({}, relationOptions.throughOptions), { sourcePk: model.getFields()[primaryKey].options.columnName, inversePk: Object.values(dbSchema.getModel(join.model.name).getFields())
                        .filter(x => x.options.isPrimaryKey == true)[0].options.columnName, tableName: (_b = (_a = dbSchema.getModel(relationOptions.throughOptions.model)) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.tableName }) : undefined }),
            tableClause: exports.mapFindOptionsToQuery(join, join.model.name)
        };
    });
    return {
        joins,
        tableName,
        modelName,
        attributes,
    };
};
