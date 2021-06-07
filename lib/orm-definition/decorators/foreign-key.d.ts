import { Model } from "../model";
import { ObjectType } from "../../repository/repository";
export declare const ForeignKey: <T extends Model<any, any>>(targetModel: (some?: any) => ObjectType<T>, as?: string | undefined) => (target: Object, propertyKey: string) => void;
