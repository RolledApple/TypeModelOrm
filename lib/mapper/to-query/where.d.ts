export declare type LogicOperator = 'AND' | 'OR' | 'NOT';
export interface WhereQueryStore {
    logicOperator: LogicOperator;
    conditions?: {
        column: string;
        comparisonOperator: string;
        value: any;
    }[];
    subClauses?: WhereQueryStore[];
}
export declare const mapWhereOptionsToQuery: (options: any, modelName: string) => WhereQueryStore | undefined;
