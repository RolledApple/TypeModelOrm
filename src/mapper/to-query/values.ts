import { DbSchema } from "../../dbSchema"

const dbSchema = DbSchema.getSchema()

export interface ValuesQueryStore {
    values: {
        column: string
        property: string
        value: any
    }[]
}

export const mapValuesToQuery = (
    valuesOptions: any,
    modelName: string,
): ValuesQueryStore => {
    const fields = dbSchema.getModel(modelName)!.getFields();
    const values = Object.keys(valuesOptions)
        .reduce((acc, key) => acc.concat({
            column: fields[key].options.columnName,
            property: key,
            value: valuesOptions[key]
        }), [] as {
            column: string
            property: string
            value: any
        }[])
    return { values }
}