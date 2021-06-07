declare const Table: (options: {
    tableName: string;
}) => (target: Function) => void;
export default Table;
