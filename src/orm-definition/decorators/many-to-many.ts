import { Model } from "../model"
import { DbSchema } from "../../dbSchema"
import { ObjectType } from "../../repository/repository"

export const ManyToMany = <RelatedModel extends Model, ThroughModel extends Model>(
    relatedOptions: {
        model: (some?: any) => ObjectType<RelatedModel>,
        property: Exclude<keyof RelatedModel, '_modelProperties' | '_modelCreationProperties'>
    },
    throughOptions: {
        model: (some?: any) => ObjectType<ThroughModel>,
        sourceKey: Exclude<keyof ThroughModel, '_modelProperties' | '_modelCreationProperties'>,
        inverseKey: Exclude<keyof ThroughModel, '_modelProperties' | '_modelCreationProperties'>,
    },
    as?: string,
) => (target: Object, propertyKey: string) => {
    const dbSchema = DbSchema.getSchema()
    dbSchema.addRelation(
        target.constructor.name,
        relatedOptions.model().name, {
        as,
        throughOptions: {
            model: throughOptions.model().name,
            sourceKey: throughOptions.inverseKey as string,
            inverseKey: throughOptions.sourceKey as string,
        },
        relationType: 'many-to-many',
        inverseProperty: relatedOptions.property as string,
        sourceProperty: propertyKey,
    })
    dbSchema.addRelation(
        relatedOptions.model().name,
        target.constructor.name, {
        as,
        throughOptions: {
            model: throughOptions.model().name,
            sourceKey: throughOptions.sourceKey as string,
            inverseKey: throughOptions.inverseKey as string,
        },
        relationType: 'many-to-many',
        inverseProperty: propertyKey,
        sourceProperty: relatedOptions.property as string,
    })
}