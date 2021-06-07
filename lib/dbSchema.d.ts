import { DataType } from "./repository/types/data-types";
export declare type RelationType = 'one-to-one' | 'many-to-many' | 'one-to-many' | 'many-to-one';
export interface FieldOptions {
    columnName: string;
    type: DataType;
    unique: boolean;
    allowNull: boolean;
    isPrimaryKey: boolean;
}
export interface FieldSchema {
    options: FieldOptions;
}
export interface ModelOptions {
    tableName: string;
}
export interface RelationOptions {
    relationType?: RelationType;
    throughOptions?: {
        model: string;
        sourceKey: string;
        inverseKey: string;
    };
    sourceFk?: string;
    inverseFk?: string;
    sourceProperty?: string;
    inverseProperty?: string;
    as?: string;
}
export interface ModelSchema {
    options?: ModelOptions;
    isFilled: () => boolean;
    addField: (name: string, options: FieldOptions) => FieldSchema;
    addRelation: (name: string, options?: RelationOptions, fkOptions?: {
        sourceFk?: string;
        inverseFk?: string;
        as?: string;
    }) => RelationOptions;
    getFields: () => {
        [k: string]: FieldSchema;
    };
    getRelations: () => {
        [k: string]: RelationOptions;
    };
    setOptions: (options: ModelOptions) => ModelOptions;
}
export declare class DbSchema {
    private constructor();
    private static instance;
    private models;
    static getSchema(): DbSchema;
    getModels(): {
        [x: string]: {
            fields: {
                [k: string]: FieldSchema;
            };
            relations: {
                [k: string]: RelationOptions;
            };
            options?: ModelOptions | undefined;
            isFilled: () => boolean;
            addField: (name: string, options: FieldOptions) => FieldSchema;
            addRelation: (name: string, options?: RelationOptions | undefined, fkOptions?: {
                sourceFk?: string | undefined;
                inverseFk?: string | undefined;
                as?: string | undefined;
            } | undefined) => RelationOptions;
            getFields: () => {
                [k: string]: FieldSchema;
            };
            getRelations: () => {
                [k: string]: RelationOptions;
            };
            setOptions: (options: ModelOptions) => ModelOptions;
        };
    }[];
    getModel(key: string): ModelSchema | undefined;
    addModel(name: string, options?: {
        tableName: string;
    }): ModelSchema;
    addField(modelName: string, fieldName: string, options: FieldOptions): void;
    addRelation(modelName: string, relationName: string, options?: RelationOptions, fkOptions?: {
        sourceFk?: string;
        inverseFk?: string;
        as?: string;
    }): void;
}
export declare class FieldSchemaImplementer implements FieldSchema {
    constructor(options: FieldOptions);
    options: FieldOptions;
}
