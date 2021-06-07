export declare type DataType = AbstractDataType;
interface AbstractDataTypeConstructor {
}
export interface AbstractDataType {
    sqlKey: string;
}
export declare const STRING: StringDataTypeConstructor;
export interface StringDataTypeConstructor extends AbstractDataTypeConstructor {
    new (options?: StringDataTypeOptions): StringDataType;
}
export interface StringDataType extends AbstractDataType {
    options: StringDataTypeOptions;
}
export interface StringDataTypeOptions {
    length?: number;
}
export declare const TEXT: TextDataType;
export interface TextDataType extends AbstractDataType {
}
export declare const INTEGER: IntegerDataType;
export interface IntegerDataType extends AbstractDataType {
}
export declare const DOUBLE: DoubleDataType;
export interface DoubleDataType extends AbstractDataType {
}
export declare const DATE: DateDataType;
export interface DateDataType extends AbstractDataType {
}
export declare const BOOLEAN: BooleanDataType;
export interface BooleanDataType extends AbstractDataType {
}
export declare const JSON: JsonDataType;
export interface JsonDataType extends AbstractDataType {
}
export declare const BLOB: BlobDataType;
export interface BlobDataType extends AbstractDataType {
}
export {};
