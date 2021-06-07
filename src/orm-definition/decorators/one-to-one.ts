import { Model } from "../model"
import { DbSchema } from "../../dbSchema"
import { ObjectType } from "../../repository/repository"

export const OneToOne = <T extends Model>(
    targetModel: (some?: any) => ObjectType<T>,
    relationProperty: Exclude<keyof T, '_modelProperties' | '_modelCreationProperties'>,
    as?: string,
) => (target: Object, propertyKey: string) => {
    const dbSchema = DbSchema.getSchema()
    dbSchema.addRelation(
        target.constructor.name,
        targetModel().name, {
        as,
        relationType: 'one-to-one',
        inverseProperty: relationProperty as string,
        sourceProperty: propertyKey,
    })
    dbSchema.addRelation(
        targetModel().name,
        target.constructor.name, {
        as,
        relationType: 'one-to-one',
        inverseProperty: propertyKey,
        sourceProperty: relationProperty as string,
    })
}