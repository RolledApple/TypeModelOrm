import { RelationType } from "../../dbSchema";
export interface SelectJoinQueryStore {
    tableName: string;
    modelName: string;
    attributes: {
        isPk: boolean;
        propKey: string;
        column: string;
        as: string;
    }[];
    joins?: {
        options: {
            through?: {
                sourcePk: string;
                inversePk: string;
                tableName: string;
                sourceKey: string;
                inverseKey: string;
            };
            sourceProperty: string;
            relationType?: RelationType;
            sourceFk: string;
            inverseFk: string;
        };
        tableClause: SelectJoinQueryStore;
    }[];
}
export declare const mapFindOptionsToQuery: (query: any, modelName: string) => SelectJoinQueryStore;
