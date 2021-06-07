declare class Op {
    static readonly and: unique symbol;
    static readonly or: unique symbol;
    static readonly not: unique symbol;
    static readonly eq: unique symbol;
    static readonly gt: unique symbol;
    static readonly gte: unique symbol;
    static readonly lt: unique symbol;
    static readonly lte: unique symbol;
    static readonly neq: unique symbol;
    static readonly like: unique symbol;
    static asSql(s: any): any;
    private static sqlAnalogs;
}
export default Op;
