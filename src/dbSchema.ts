import { DataType } from "./repository/types/data-types"

export type RelationType =
    | 'one-to-one'
    | 'many-to-many'
    | 'one-to-many'
    | 'many-to-one'

export interface FieldOptions {
    columnName: string
    type: DataType
    unique: boolean
    allowNull: boolean
    isPrimaryKey: boolean
}

export interface FieldSchema {
    options: FieldOptions
}

export interface ModelOptions {
    tableName: string
}

export interface RelationOptions {
    relationType?: RelationType
    throughOptions?: {
        model: string
        sourceKey: string
        inverseKey: string
    }
    sourceFk?: string
    inverseFk?: string
    sourceProperty?: string
    inverseProperty?: string
    as?: string
}

export interface ModelSchema {
    options?: ModelOptions
    isFilled: () => boolean
    addField: (
        name: string,
        options: FieldOptions,
    ) => FieldSchema
    addRelation: (
        name: string,
        options?: RelationOptions,
        fkOptions?: {
            sourceFk?: string,
            inverseFk?: string,
            as?: string
        },
    ) => RelationOptions
    getFields: () => {
        [k: string]: FieldSchema
    }
    getRelations: () => {
        [k: string]: RelationOptions
    }
    setOptions: (options: ModelOptions) => ModelOptions
}

export class DbSchema {
    private constructor() {
        this.models = new Map()
    }
    private static instance: DbSchema

    private models: Map<string, ModelSchema>

    public static getSchema(): DbSchema {
        if (!DbSchema.instance)
            DbSchema.instance = new DbSchema()
        return DbSchema.instance
    }

    public getModels() {
        const models = Object.fromEntries(this.models)
        return Object.keys(models).map(m => ({
            [m]: {
                ...models[m],
                fields: models[m].getFields(),
                relations: models[m].getRelations(),
            }
        }))
    }

    public getModel(key: string) {
        return this.models.get(key)
    }

    public addModel(
        name: string,
        options?: {
            tableName: string
        }) {
        const model = this.models.get(name)
        if (model) {
            if (!options)
                return model
            if (model.isFilled())
                throw new Error('Duplicate models.')
            model.setOptions(options)
            this.models.set(name, model)
            return model
        }
        const modelSchema = new ModelSchemaImplementer(options)
        this.models.set(name, modelSchema)
        return modelSchema
    }

    public addField(
        modelName: string,
        fieldName: string,
        options: FieldOptions
    ) {
        const model = this.models.has(modelName) ?
            this.models.get(modelName)! :
            this.addModel(modelName)
        model.addField(
            fieldName,
            options,
        )
        this.models.set(modelName, model)
    }

    public addRelation(
        modelName: string,
        relationName: string,
        options?: RelationOptions,
        fkOptions?: {
            sourceFk?: string,
            inverseFk?: string,
            as?: string
        },
    ) {
        const model = this.models.has(modelName) ?
            this.models.get(modelName)! :
            this.addModel(modelName)
        model.addRelation(
            relationName,
            options,
            fkOptions,
        )
    }
}

class ModelSchemaImplementer implements ModelSchema {
    constructor(options?: {
        tableName: string
    }) {
        this.options = options
        this.fields = new Map()
        this.relations = new Map()
    }
    public setOptions(options: ModelOptions) {
        this.options = options
        return options
    }
    public addField(
        name: string,
        options: FieldOptions,
    ) {
        if (this.fields.has(name)) {
            throw new Error('Duplicate fields.')
        }
        const fieldSchema = new FieldSchemaImplementer(options)
        this.fields.set(name, fieldSchema)
        return fieldSchema
    }
    public addRelation(
        name: string,
        options?: RelationOptions,
        fkOptions?: {
            sourceFk?: string,
            inverseFk?: string,
            as?: string
        },
    ) {
        const existingRelation = this.relations.get(name)
        if (existingRelation) {
            if (!options && fkOptions) {
                this.relations.set(name, {
                    ...existingRelation,
                    ...fkOptions,
                })
                return this.relations.get(name)!
            }
            if (!options) throw Error
            if (existingRelation.relationType && (!options.as || !existingRelation.as ||
                options.as === existingRelation.as)) {
                throw new Error('Duplicate relation assigning.')
            }
            this.relations.set(name, {
                ...existingRelation,
                ...options,
            })
            return this.relations.get(name)!
        } else {
            if (options) this.relations.set(name, options)
            else if (fkOptions) this.relations.set(name, fkOptions)
            else throw Error
            return this.relations.get(name)!
        }
    }
    public isFilled() {
        return !!this.options
    }
    public getFields() {
        return Object.fromEntries(this.fields)
    }
    getRelations() {
        return Object.fromEntries(this.relations)
    }

    public options?: ModelOptions
    private fields: Map<string, FieldSchema>
    public relations: Map<string, RelationOptions>
}

export class FieldSchemaImplementer implements FieldSchema {
    constructor(options: FieldOptions) {
        this.options = options
    }
    public options: FieldOptions
}