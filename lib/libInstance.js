"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("./repository/repository");
class TypeModelOrm {
    constructor(config) {
        this.config = config;
    }
    addModels(models) {
        for (const model of models) {
            console.log(model.prototype);
        }
    }
    getRepository(target) {
        return new repository_1.Repository(target, this.config);
    }
}
exports.default = TypeModelOrm;
