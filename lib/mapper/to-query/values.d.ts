export interface ValuesQueryStore {
    values: {
        column: string;
        property: string;
        value: any;
    }[];
}
export declare const mapValuesToQuery: (valuesOptions: any, modelName: string) => ValuesQueryStore;
