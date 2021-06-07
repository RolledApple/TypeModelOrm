import { DbSchema } from "../../dbSchema"

const Table = (options: {
    tableName: string,
}) => (target: Function) => {
    const dbSchema = DbSchema.getSchema()
    dbSchema.addModel(target.name, options)
}

export default Table
