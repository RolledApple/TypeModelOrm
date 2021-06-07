export type DataType = AbstractDataType

interface AbstractDataTypeConstructor { }

export interface AbstractDataType {
    sqlKey: string
}

export const STRING: StringDataTypeConstructor =
    class StringDataTypeImplementer implements StringDataType {
        constructor(options?: StringDataTypeOptions) {
            if (options && options.length) {
                this.sqlKey = `VARCHAR${options.length}`
                this.options = new StringDataTypeOptionsImplementer(options.length)
            } else {
                this.sqlKey = `VARCHAR`
                this.options = new StringDataTypeOptionsImplementer()
            }
        }
        sqlKey: string
        options: StringDataTypeOptions
    }

export interface StringDataTypeConstructor extends AbstractDataTypeConstructor {
    new(options?: StringDataTypeOptions): StringDataType
}

export interface StringDataType extends AbstractDataType {
    options: StringDataTypeOptions
}

class StringDataTypeOptionsImplementer {
    constructor(length?: number) {
        this.length = length
    }
    length?: number
}

export interface StringDataTypeOptions {
    length?: number
}

class TextDataTypeImplementer implements TextDataType {
    constructor() {
        this.sqlKey = 'TEXT'
    }
    sqlKey: string
}

export const TEXT: TextDataType = new TextDataTypeImplementer()

export interface TextDataType extends AbstractDataType { }

class IntegerDataTypeImplementer implements IntegerDataType {
    constructor() {
        this.sqlKey = 'INTEGER'
    }
    sqlKey: string
}

export const INTEGER: IntegerDataType = new IntegerDataTypeImplementer()

export interface IntegerDataType extends AbstractDataType { }

class DoubleDataTypeImplementer implements DoubleDataType {
    constructor() {
        this.sqlKey = 'DOUBLE PRECISION'
    }
    sqlKey: string
}

export const DOUBLE: DoubleDataType = new DoubleDataTypeImplementer()

export interface DoubleDataType extends AbstractDataType { }

class DateDataTypeImplementer implements DateDataType {
    constructor() {
        this.sqlKey = 'TIMESTAMP WITH TIME ZONE'
    }
    sqlKey: string
}

export const DATE: DateDataType = new DateDataTypeImplementer()

export interface DateDataType extends AbstractDataType { }

class BooleanDataTypeImplementer implements BooleanDataType {
    constructor() {
        this.sqlKey = 'BOOLEAN'
    }
    sqlKey: string
}

export const BOOLEAN: BooleanDataType = new BooleanDataTypeImplementer()

export interface BooleanDataType extends AbstractDataType { }

class JsonDataTypeImplementer implements JsonDataType {
    constructor() {
        this.sqlKey = 'JSON'
    }
    sqlKey: string
}

export const JSON: JsonDataType = new JsonDataTypeImplementer()

export interface JsonDataType extends AbstractDataType { }

class BlobDataTypeImplementer implements BlobDataType {
    constructor() {
        this.sqlKey = 'BYTEA'
    }
    sqlKey: string
}

export const BLOB: BlobDataType = new BlobDataTypeImplementer()

export interface BlobDataType extends AbstractDataType { }
