import { Model } from "../model"
import { DbSchema } from "../../dbSchema"
import { ObjectType } from "../../repository/repository"

export const ManyToOne = <T extends Model>(
    targetModel: (some?: any) => ObjectType<T>,
    relationProperty: Exclude<keyof T, '_modelProperties' | '_modelCreationProperties'>,
    inverseFk?: Exclude<keyof T, '_modelProperties' | '_modelCreationProperties'>,
    as?: string,
) => (target: Object, propertyKey: string) => {
    const dbSchema = DbSchema.getSchema()
    dbSchema.addRelation(
        target.constructor.name,
        targetModel().name, {
        as,
        relationType: 'many-to-one',
        inverseProperty: relationProperty as string,
        sourceProperty: propertyKey,
        inverseFk: inverseFk ? inverseFk as string : 'id',
    })
    dbSchema.addRelation(
        targetModel().name,
        target.constructor.name, {
        as,
        relationType: 'one-to-many',
        inverseProperty: propertyKey,
        sourceProperty: relationProperty as string,
        sourceFk: inverseFk ? inverseFk as string : 'id',
    })
}