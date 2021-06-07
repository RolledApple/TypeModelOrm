import * as utils from '../../utils'
import Op from "../../repository/options/operators"
import { DbSchema, FieldSchema } from "../../dbSchema"

export type LogicOperator = 'AND' | 'OR' | 'NOT'

export interface WhereQueryStore {
    logicOperator: LogicOperator
    conditions?: {
        column: string
        comparisonOperator: string
        value: any
    }[],
    subClauses?: WhereQueryStore[]
}

const dbSchema = DbSchema.getSchema()

const createCondition = (
    fields: {
        [k: string]: FieldSchema
    }, query: any,
    propKey: string
) => {
    const column = fields[propKey].options.columnName
    if (utils.isPrimitive(query)) {
        return {
            column,
            comparisonOperator: "=",
            value: query,
        }
    } else {
        const gt = query[Op.gt]
        if (gt)
            return {
                column,
                value: query[Op.gt],
                comparisonOperator: Op.asSql(Op.gt),
            }
        const gte = query[Op.gte]
        if (gte)
            return {
                column,
                value: query[Op.gte],
                comparisonOperator: Op.asSql(Op.gte),
            }
        const lt = query[Op.lt]
        if (lt)
            return {
                column,
                value: query[Op.lt],
                comparisonOperator: Op.asSql(Op.lt),
            }
        const lte = query[Op.lte]
        if (lte)
            return {
                column,
                value: query[Op.lte],
                comparisonOperator: Op.asSql(Op.lte),
            }
        const neq = query[Op.neq]
        if (neq)
            return {
                column,
                value: query[Op.neq],
                comparisonOperator: Op.asSql(Op.neq),
            }
        const like = query[Op.like]
        const kek = 'asdf'
        if (like)
            return {
                column,
                value: query[Op.like].replace(/\*/g, '%').replace(/\?/g, '_'),
                comparisonOperator: Op.asSql(Op.like),
            }
    }

}

const createLogicsubQuery = (fields: {
    [k: string]: FieldSchema
}) => (
    query: any,
    logicOperator: LogicOperator,
    ): WhereQueryStore => {
        const properyKeys = Object.getOwnPropertyNames(query)
        const operatorKeys = Object.getOwnPropertySymbols(query)
        const initializedFunc = createLogicsubQuery(fields)
        return {
            logicOperator,
            conditions: properyKeys.map(key => createCondition(fields, query[key], key)!),
            subClauses: operatorKeys.map(key => initializedFunc(query[key], Op.asSql(key)))
        }
    }

export const mapWhereOptionsToQuery = (
    options: any,
    modelName: string,
) => {
    if (!options || !options.where) return undefined
    const modelFields = dbSchema.getModel(modelName)!.getFields()

    const rootPropertyKeys = Object.getOwnPropertyNames(options.where)
    const rootOperatorKeys = Object.getOwnPropertySymbols(options.where)
    const [rootLogicOperator, rootQuery] =
        rootPropertyKeys.length !== 0 || rootOperatorKeys.length > 1 ? ['AND', options.where]
            : [Op.asSql(rootOperatorKeys[0]), (<any>options.where)[rootOperatorKeys[0]]]
    const whereClause: WhereQueryStore = createLogicsubQuery(modelFields)(
        rootQuery,
        rootLogicOperator
    )
    return whereClause
}