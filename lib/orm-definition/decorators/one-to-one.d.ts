import { Model } from "../model";
import { ObjectType } from "../../repository/repository";
export declare const OneToOne: <T extends Model<any, any>>(targetModel: (some?: any) => ObjectType<T>, relationProperty: Exclude<keyof T, "_modelProperties" | "_modelCreationProperties">, as?: string | undefined) => (target: Object, propertyKey: string) => void;
