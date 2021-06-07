"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const splitObjToWhereSqlClause = (addArg) => (tableName, jsClause) => {
    const initializedFunc = splitObjToWhereSqlClause(addArg);
    const conditions = jsClause.conditions ? jsClause.conditions
        .map(c => `("${tableName}"."${c.column}" ${c.comparisonOperator} $${addArg(c.value)})`)
        : [];
    const subClauseConditions = jsClause.subClauses ? jsClause.subClauses
        .reduce((acc, curr) => acc.concat(initializedFunc(tableName, curr)), [])
        : [];
    return combineConditions(conditions.concat(subClauseConditions), jsClause.logicOperator);
};
const combineConditions = (conditions, logicOp) => logicOp !== "NOT" ? ` (${conditions.join(` ${logicOp} `)}) `
    : ` (NOT ( ${conditions.join(" AND ")} )) `;
exports.where = (jsClause, tableName, args) => {
    const addArg = (arg) => args.push(arg);
    const clause = splitObjToWhereSqlClause(addArg)(tableName, jsClause);
    return { clause, args };
};
const splitObjToSelectJoinSqlClause = (addColumn) => (jsClause) => {
    const initializedFunc = splitObjToSelectJoinSqlClause(addColumn);
    jsClause.attributes
        .forEach((att) => addColumn(`\n"${jsClause.tableName}"."${att.column}" as "${att.as}"`));
    const joins = jsClause.joins ? jsClause.joins
        .reduce((acc, curr) => {
        var _a, _b, _c, _d, _e;
        return acc = acc +
            createJoin(jsClause.tableName, curr.tableClause.tableName, {
                sourceFk: curr.options.sourceFk,
                inverseFk: curr.options.inverseFk,
            }, curr.options.relationType === 'many-to-many' ? {
                sourcePk: (_a = curr.options.through) === null || _a === void 0 ? void 0 : _a.sourcePk,
                inversePk: (_b = curr.options.through) === null || _b === void 0 ? void 0 : _b.inversePk,
                tableName: (_c = curr.options.through) === null || _c === void 0 ? void 0 : _c.tableName,
                sourceKey: (_d = curr.options.through) === null || _d === void 0 ? void 0 : _d.sourceKey,
                inverseKey: (_e = curr.options.through) === null || _e === void 0 ? void 0 : _e.inverseKey
            } : undefined) +
            initializedFunc(curr.tableClause);
    }, "\n")
        : '';
    return joins;
};
const createJoin = (sourceTable, inverseTable, on, through) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return through ? `INNER JOIN "${(_a = through) === null || _a === void 0 ? void 0 : _a.tableName}" ` +
        `ON "${sourceTable}"."${(_b = through) === null || _b === void 0 ? void 0 : _b.sourcePk}" = "${(_c = through) === null || _c === void 0 ? void 0 : _c.tableName}"."${(_d = through) === null || _d === void 0 ? void 0 : _d.sourceKey}" \n` +
        `INNER JOIN "${inverseTable}" ON "${(_e = through) === null || _e === void 0 ? void 0 : _e.tableName}"."${(_f = through) === null || _f === void 0 ? void 0 : _f.inverseKey}" = "${inverseTable}"."${(_g = through) === null || _g === void 0 ? void 0 : _g.inversePk}"`
        : `INNER JOIN "${inverseTable}" ` + `ON "${sourceTable}"."${on.sourceFk}" = "${inverseTable}"."${on.inverseFk}"`;
};
exports.columnsJoin = (jsClause) => {
    const columns = [];
    const addColumn = (newColumn) => columns.push(newColumn);
    const joinClause = splitObjToSelectJoinSqlClause(addColumn)(jsClause);
    return { columns, joinClause };
};
exports.insert = (insertQuery) => {
    const { columns, args, interpolations } = insertQuery.values
        .reduce((acc, curr) => ({
        columns: acc.columns.concat(`"${curr.column}"`),
        args: acc.args.concat(curr.value),
        interpolations: acc.interpolations.concat(`$${acc.args.length + 1}`),
    }), { args: [], columns: [], interpolations: [] });
    const clause = `(${columns.join(', ')}) VALUES (${interpolations.join(', ')})`;
    return { clause, args };
};
exports.update = (valuesStore) => {
    const { clause, args } = valuesStore.values
        .reduce((acc, curr) => ({
        clause: acc.clause + `${curr.column} = $${acc.args.length + 1}, `,
        args: acc.args.concat(curr.value)
    }), { clause: '', args: [] });
    return {
        args,
        clause: 'SET ' + clause.slice(0, -2)
    };
};
