import { v4 as uuidv4 } from 'uuid'

import { DbSchema, RelationType } from "../../dbSchema"
import { FindAttributeQuery, IncludeQuery } from "../../repository/options/include/include-options"

const dbSchema = DbSchema.getSchema()

export interface SelectJoinQueryStore {
    tableName: string
    modelName: string
    attributes: {
        isPk: boolean
        propKey: string
        column: string
        as: string
    }[]
    joins?: {
        options: {
            through?: {
                sourcePk: string
                inversePk: string
                tableName: string
                sourceKey: string
                inverseKey: string
            },
            sourceProperty: string
            relationType?: RelationType
            sourceFk: string
            inverseFk: string
        }
        tableClause: SelectJoinQueryStore
    }[]
}

export const mapFindOptionsToQuery = (
    query: any,
    modelName: string,
): SelectJoinQueryStore => {
    const model = dbSchema.getModel(modelName)!
    const attributeKeys: FindAttributeQuery<any> | undefined = query['attributes']
    const includes: IncludeQuery<any>[] | undefined = query['include']
    const properties = Object.keys(model.getFields())
    const primaryKey = properties
        .filter(key => model.getFields()[key].options.isPrimaryKey === true)
        .find(_ => true)!

    const tableName = model.options?.tableName!
    const props = !attributeKeys ? properties
        : attributeKeys.include ? attributeKeys.include
            : properties.filter(x => attributeKeys.exclude!.includes(x))
    if (!props.includes(primaryKey)) props.push(primaryKey)
    const attributes = props.map((key: any) => {
        const column = model.getFields()[key].options.columnName
        return {
            isPk: key === primaryKey,
            propKey: key,
            column,
            as: `${model.options?.tableName}_${column}_${uuidv4()}`
        }
    })
    const joins = includes?.map(join => {
        const relationOptions: any = model.getRelations()[join.model.name]
        return {
            options: {
                ...relationOptions,
                through: relationOptions.throughOptions ? {
                    ...relationOptions.throughOptions,
                    sourcePk: model.getFields()[primaryKey].options.columnName,
                    inversePk: Object.values(dbSchema.getModel(join.model.name)!.getFields())
                        .filter(x => x.options.isPrimaryKey == true)[0].options.columnName,
                    tableName: dbSchema.getModel(relationOptions.throughOptions.model)?.options?.tableName!
                } : undefined
            },
            tableClause: mapFindOptionsToQuery(join, join.model.name)
        }
    })
    return {
        joins,
        tableName,
        modelName,
        attributes,
    }
}