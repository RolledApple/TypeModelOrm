import { ValuesQueryStore } from '../mapper/to-query/values';
import { SelectJoinQueryStore } from '../mapper/to-query/select-join';
import { WhereQueryStore } from '../mapper/to-query/where';
export declare const where: (jsClause: WhereQueryStore, tableName: string, args: any[]) => {
    clause: string;
    args: any[];
};
export declare const columnsJoin: (jsClause: SelectJoinQueryStore) => {
    columns: string[];
    joinClause: string;
};
export declare const insert: (insertQuery: ValuesQueryStore) => {
    clause: string;
    args: string[];
};
export declare const update: (valuesStore: ValuesQueryStore) => {
    args: never[];
    clause: string;
};
