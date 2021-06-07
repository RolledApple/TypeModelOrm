class Op {
    static readonly and: unique symbol = Symbol('AND')
    static readonly or: unique symbol = Symbol('OR')
    static readonly not: unique symbol = Symbol('NOT')
    static readonly eq: unique symbol = Symbol('EQ')
    static readonly gt: unique symbol = Symbol('>')
    static readonly gte: unique symbol = Symbol('>=')
    static readonly lt: unique symbol = Symbol('<')
    static readonly lte: unique symbol = Symbol('<=')
    static readonly neq: unique symbol = Symbol('<>')
    static readonly like: unique symbol = Symbol('LIKE')

    public static asSql(s: any) {
        return Op.sqlAnalogs[s]
    }
    private static sqlAnalogs: any = {
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
    }
}

export default Op