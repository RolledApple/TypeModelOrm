import { DbSchema } from "../../dbSchema"

const dbSchema = DbSchema.getSchema()

export const mapNonJoinSqlRowsToModel = (
    rows: any[],
    modelName: string,
) => {
    const fields = dbSchema.getModel(modelName)!.getFields()
    return rows.map(row => Object.keys(fields)
        .reduce((acc, curr) =>
            Object.assign(acc, { [curr]: row[fields[curr].options.columnName] }),
            {})
    )
}