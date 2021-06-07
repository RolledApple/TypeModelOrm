"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("./repository/options/operators");
// const operatorsSet = new Set<string>(['and', 'or'])
const operatorsSet = new Set(Object.values(operators_1.default));
// console.log('kek: ', kek)
exports.getOperators = (obj) => {
    console.log(Object.getOwnPropertyNames(obj));
    Object.getOwnPropertyNames(obj)
        .filter(s => operatorsSet.has(s));
};
// export const getComplexKeys = (obj: any) =>
//     getOperators(obj).concat(Object.keys(obj))
exports.getNotOperatorsKeys = (obj) => Object.getOwnPropertyNames(obj)
    .filter(s => !operatorsSet.has(s));
exports.isPrimitive = (obj) => obj !== Object(obj);
