import { DbSchema } from "../../dbSchema"

const dbSchema = DbSchema.getSchema()

export const mapInsertSqlToModel = (
    rows: any[],
    modelName: string,
) => {
    const row = rows.find(_ => true)
    const fields = dbSchema.getModel(modelName)!.getFields()
    return Object.keys(fields)
        .reduce((acc, curr) =>
            Object.assign(acc, { [curr]: row[fields[curr].options.columnName] }),
            {})
}
