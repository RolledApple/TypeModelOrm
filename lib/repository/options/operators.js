"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Op {
    static asSql(s) {
        return Op.sqlAnalogs[s];
    }
}
Op.and = Symbol('AND');
Op.or = Symbol('OR');
Op.not = Symbol('NOT');
Op.eq = Symbol('EQ');
Op.gt = Symbol('>');
Op.gte = Symbol('>=');
Op.lt = Symbol('<');
Op.lte = Symbol('<=');
Op.neq = Symbol('<>');
Op.like = Symbol('LIKE');
Op.sqlAnalogs = {
    [Op.and]: 'AND',
    [Op.or]: 'OR',
    [Op.not]: 'NOT',
    [Op.eq]: '=',
    [Op.neq]: '<>',
    [Op.gt]: '>',
    [Op.gte]: '>=',
    [Op.lt]: '<',
    [Op.lte]: '<=',
    [Op.like]: 'LIKE',
};
exports.default = Op;
