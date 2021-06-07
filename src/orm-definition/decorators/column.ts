import { DbSchema } from "../../dbSchema"
import { DataType } from "../../repository/types/data-types"

export const Column = (options: {
    columnName?: string
    type: DataType
    unique?: boolean
    allowNull?: boolean
    isPrimaryKey?: boolean
}) => (target: Object, propertyKey: string) => {
    const dbSchema = DbSchema.getSchema()
    dbSchema.addField(
        target.constructor.name,
        propertyKey, {
        ...options,
        unique: options.unique === undefined ? false : options.unique,
        allowNull: options.allowNull === undefined ? true : options.allowNull,
        columnName: options.columnName === undefined ? propertyKey : options.columnName,
        isPrimaryKey: options.isPrimaryKey === undefined ? false : options.isPrimaryKey,
    })
}

export default Column