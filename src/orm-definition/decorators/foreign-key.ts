import { Model } from "../model"
import { DbSchema } from "../../dbSchema"
import { ObjectType } from "../../repository/repository"

export const ForeignKey = <T extends Model>(
    targetModel: (some?: any) => ObjectType<T>,
    as?: string,
) => (target: Object, propertyKey: string) => {
    const dbSchema = DbSchema.getSchema()
    dbSchema.addRelation(
        target.constructor.name,
        targetModel().name,
        undefined, {
        as,
        sourceFk: propertyKey,
    })
    dbSchema.addRelation(
        targetModel().name,
        target.constructor.name,
        undefined, {
        as,
        inverseFk: propertyKey,
    })
}