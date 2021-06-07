export declare const Column: (options: {
    columnName?: string | undefined;
    type: import("../../repository/types/data-types").AbstractDataType;
    unique?: boolean | undefined;
    allowNull?: boolean | undefined;
    isPrimaryKey?: boolean | undefined;
}) => (target: Object, propertyKey: string) => void;
export default Column;
