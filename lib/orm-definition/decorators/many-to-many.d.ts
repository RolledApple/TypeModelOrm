import { Model } from "../model";
import { ObjectType } from "../../repository/repository";
export declare const ManyToMany: <RelatedModel extends Model<any, any>, ThroughModel extends Model<any, any>>(relatedOptions: {
    model: (some?: any) => ObjectType<RelatedModel>;
    property: Exclude<keyof RelatedModel, "_modelProperties" | "_modelCreationProperties">;
}, throughOptions: {
    model: (some?: any) => ObjectType<ThroughModel>;
    sourceKey: Exclude<keyof ThroughModel, "_modelProperties" | "_modelCreationProperties">;
    inverseKey: Exclude<keyof ThroughModel, "_modelProperties" | "_modelCreationProperties">;
}, as?: string | undefined) => (target: Object, propertyKey: string) => void;
