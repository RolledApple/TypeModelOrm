"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DbSchema {
    constructor() {
        this.models = new Map();
    }
    static getSchema() {
        if (!DbSchema.instance)
            DbSchema.instance = new DbSchema();
        return DbSchema.instance;
    }
    getModels() {
        const models = Object.fromEntries(this.models);
        return Object.keys(models).map(m => ({
            [m]: Object.assign(Object.assign({}, models[m]), { fields: models[m].getFields(), relations: models[m].getRelations() })
        }));
    }
    getModel(key) {
        return this.models.get(key);
    }
    addModel(name, options) {
        const model = this.models.get(name);
        if (model) {
            if (!options)
                return model;
            if (model.isFilled())
                throw new Error('Duplicate models.');
            model.setOptions(options);
            this.models.set(name, model);
            return model;
        }
        const modelSchema = new ModelSchemaImplementer(options);
        this.models.set(name, modelSchema);
        return modelSchema;
    }
    addField(modelName, fieldName, options) {
        const model = this.models.has(modelName) ?
            this.models.get(modelName) :
            this.addModel(modelName);
        model.addField(fieldName, options);
        this.models.set(modelName, model);
    }
    addRelation(modelName, relationName, options, fkOptions) {
        const model = this.models.has(modelName) ?
            this.models.get(modelName) :
            this.addModel(modelName);
        model.addRelation(relationName, options, fkOptions);
    }
}
exports.DbSchema = DbSchema;
class ModelSchemaImplementer {
    constructor(options) {
        this.options = options;
        this.fields = new Map();
        this.relations = new Map();
    }
    setOptions(options) {
        this.options = options;
        return options;
    }
    addField(name, options) {
        if (this.fields.has(name)) {
            throw new Error('Duplicate fields.');
        }
        const fieldSchema = new FieldSchemaImplementer(options);
        this.fields.set(name, fieldSchema);
        return fieldSchema;
    }
    addRelation(name, options, fkOptions) {
        const existingRelation = this.relations.get(name);
        if (existingRelation) {
            if (!options && fkOptions) {
                this.relations.set(name, Object.assign(Object.assign({}, existingRelation), fkOptions));
                return this.relations.get(name);
            }
            if (!options)
                throw Error;
            if (existingRelation.relationType && (!options.as || !existingRelation.as ||
                options.as === existingRelation.as)) {
                throw new Error('Duplicate relation assigning.');
            }
            this.relations.set(name, Object.assign(Object.assign({}, existingRelation), options));
            return this.relations.get(name);
        }
        else {
            if (options)
                this.relations.set(name, options);
            else if (fkOptions)
                this.relations.set(name, fkOptions);
            else
                throw Error;
            return this.relations.get(name);
        }
    }
    isFilled() {
        return !!this.options;
    }
    getFields() {
        return Object.fromEntries(this.fields);
    }
    getRelations() {
        return Object.fromEntries(this.relations);
    }
}
class FieldSchemaImplementer {
    constructor(options) {
        this.options = options;
    }
}
exports.FieldSchemaImplementer = FieldSchemaImplementer;
