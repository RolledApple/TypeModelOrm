import { ValuesQueryStore } from '../mapper/to-query/values'
import { SelectJoinQueryStore } from '../mapper/to-query/select-join'
import { WhereQueryStore, LogicOperator } from '../mapper/to-query/where'

const splitObjToWhereSqlClause = (addArg: (arg: any) => number) => (
    tableName: string,
    jsClause: WhereQueryStore,
): string => {
    const initializedFunc = splitObjToWhereSqlClause(addArg)
    const conditions = jsClause.conditions ? jsClause.conditions
        .map(c => `("${tableName}"."${c.column}" ${c.comparisonOperator} $${addArg(c.value)})`)
        : []
    const subClauseConditions = jsClause.subClauses ? jsClause.subClauses
        .reduce((acc, curr) => acc.concat(initializedFunc(tableName, curr)), [] as string[])
        : []
    return combineConditions(conditions.concat(subClauseConditions), jsClause.logicOperator)
}

const combineConditions = (conditions: string[], logicOp: LogicOperator) =>
    logicOp !== "NOT" ? ` (${conditions.join(` ${logicOp} `)}) `
        : ` (NOT ( ${conditions.join(" AND ")} )) `

export const where = (jsClause: WhereQueryStore, tableName: string, args: any[]) => {
    const addArg = (arg: any): number => args.push(arg)
    const clause = splitObjToWhereSqlClause(addArg)(tableName, jsClause)
    return { clause, args }
}

const splitObjToSelectJoinSqlClause = (
    addColumn: (select: string) => any,
) => (jsClause: SelectJoinQueryStore): string => {
    const initializedFunc = splitObjToSelectJoinSqlClause(addColumn)
    jsClause.attributes
        .forEach((att) => addColumn(`\n"${jsClause.tableName}"."${att.column}" as "${att.as}"`))
    const joins = jsClause.joins ? jsClause.joins
        .reduce((acc, curr) => acc = acc +
            createJoin(
                jsClause.tableName,
                curr.tableClause.tableName, {
                sourceFk: curr.options.sourceFk,
                inverseFk: curr.options.inverseFk,
            }, curr.options.relationType === 'many-to-many' ? {
                sourcePk: curr.options.through?.sourcePk!,
                inversePk: curr.options.through?.inversePk!,
                tableName: curr.options.through?.tableName!,
                sourceKey: curr.options.through?.sourceKey!,
                inverseKey: curr.options.through?.inverseKey!
            } : undefined) +
            initializedFunc(curr.tableClause),
            "\n")
        : ''
    return joins
}

const createJoin = (
    sourceTable: string,
    inverseTable: string,
    on: {
        sourceFk: string,
        inverseFk: string
    },
    through?: {
        sourcePk: string
        inversePk: string
        tableName: string
        sourceKey: string
        inverseKey: string
    }
) => through ? `INNER JOIN "${through?.tableName}" ` +
    `ON "${sourceTable}"."${through?.sourcePk}" = "${through?.tableName}"."${through?.sourceKey}" \n` +
    `INNER JOIN "${inverseTable}" ON "${through?.tableName}"."${through?.inverseKey}" = "${inverseTable}"."${through?.inversePk}"`
        : `INNER JOIN "${inverseTable}" ` + `ON "${sourceTable}"."${on.sourceFk}" = "${inverseTable}"."${on.inverseFk}"`

export const columnsJoin = (jsClause: SelectJoinQueryStore) => {
    const columns: string[] = []
    const addColumn = (newColumn: string) => columns.push(newColumn)
    const joinClause = splitObjToSelectJoinSqlClause(addColumn)(jsClause)
    return { columns, joinClause }
}

export const insert = (insertQuery: ValuesQueryStore) => {
    const { columns, args, interpolations } = insertQuery.values
        .reduce((acc, curr) => ({
            columns: acc.columns.concat(`"${curr.column}"`),
            args: acc.args.concat(curr.value),
            interpolations: acc.interpolations.concat(`$${acc.args.length + 1}`),
        }), { args: [], columns: [], interpolations: [] } as {
            args: string[]
            columns: string[]
            interpolations: string[]
        })
    const clause = `(${columns.join(', ')}) VALUES (${interpolations.join(', ')})`
    return { clause, args }
}

export const update = (valuesStore: ValuesQueryStore) => {
    const { clause, args } = valuesStore.values
        .reduce((acc, curr) => ({
            clause: acc.clause + `${curr.column} = $${acc.args.length + 1}, `,
            args: acc.args.concat(curr.value)
        }), { clause: '', args: [] })
    return {
        args,
        clause: 'SET ' + clause.slice(0, -2)
    }
}