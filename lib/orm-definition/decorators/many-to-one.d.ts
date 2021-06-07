import { Model } from "../model";
import { ObjectType } from "../../repository/repository";
export declare const ManyToOne: <T extends Model<any, any>>(targetModel: (some?: any) => ObjectType<T>, relationProperty: Exclude<keyof T, "_modelProperties" | "_modelCreationProperties">, inverseFk?: Exclude<keyof T, "_modelProperties" | "_modelCreationProperties"> | undefined, as?: string | undefined) => (target: Object, propertyKey: string) => void;
