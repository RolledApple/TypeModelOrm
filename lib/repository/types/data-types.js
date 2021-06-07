"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRING = class StringDataTypeImplementer {
    constructor(options) {
        if (options && options.length) {
            this.sqlKey = `VARCHAR${options.length}`;
            this.options = new StringDataTypeOptionsImplementer(options.length);
        }
        else {
            this.sqlKey = `VARCHAR`;
            this.options = new StringDataTypeOptionsImplementer();
        }
    }
};
class StringDataTypeOptionsImplementer {
    constructor(length) {
        this.length = length;
    }
}
class TextDataTypeImplementer {
    constructor() {
        this.sqlKey = 'TEXT';
    }
}
exports.TEXT = new TextDataTypeImplementer();
class IntegerDataTypeImplementer {
    constructor() {
        this.sqlKey = 'INTEGER';
    }
}
exports.INTEGER = new IntegerDataTypeImplementer();
class DoubleDataTypeImplementer {
    constructor() {
        this.sqlKey = 'DOUBLE PRECISION';
    }
}
exports.DOUBLE = new DoubleDataTypeImplementer();
class DateDataTypeImplementer {
    constructor() {
        this.sqlKey = 'TIMESTAMP WITH TIME ZONE';
    }
}
exports.DATE = new DateDataTypeImplementer();
class BooleanDataTypeImplementer {
    constructor() {
        this.sqlKey = 'BOOLEAN';
    }
}
exports.BOOLEAN = new BooleanDataTypeImplementer();
class JsonDataTypeImplementer {
    constructor() {
        this.sqlKey = 'JSON';
    }
}
exports.JSON = new JsonDataTypeImplementer();
class BlobDataTypeImplementer {
    constructor() {
        this.sqlKey = 'BYTEA';
    }
}
exports.BLOB = new BlobDataTypeImplementer();
