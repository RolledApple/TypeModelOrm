"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.mapJoinSqlRowsToModel = (rows, queryStore) => _
    .chain(rows)
    .groupBy(queryStore.attributes.find(x => x.isPk).as)
    .map(row => {
    var _a;
    const model = queryStore.attributes
        .reduce((accObj, currAtt) => Object.assign(accObj, { [currAtt.propKey]: row.find(_ => true)[currAtt.as] }), {});
    const relations = (_a = queryStore.joins) === null || _a === void 0 ? void 0 : _a.reduce((accObj, join) => {
        const joinedModel = exports.mapJoinSqlRowsToModel(row, join.tableClause);
        return Object.assign(accObj, {
            [join.options.sourceProperty]: (join.options.relationType === 'many-to-many' || join.options.relationType === 'one-to-one') ?
                joinedModel.find((_) => true)
                : joinedModel
        });
    }, {});
    return Object.assign(Object.assign({}, model), relations);
})
    .value();
