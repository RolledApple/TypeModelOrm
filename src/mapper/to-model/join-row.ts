import _ = require("lodash")
import { SelectJoinQueryStore } from "../to-query/select-join"

export const mapJoinSqlRowsToModel = (
    rows: any[],
    queryStore: SelectJoinQueryStore
): any => _
    .chain(rows)
    .groupBy(queryStore.attributes.find(x => x.isPk)!.as)
    .map(row => {
        const model = queryStore.attributes
            .reduce((accObj, currAtt) =>
                Object.assign(accObj, { [currAtt.propKey]: row.find(_ => true)[currAtt.as] }),
                {})
        const relations = queryStore.joins?.reduce((accObj, join) => {
            const joinedModel = mapJoinSqlRowsToModel(row, join.tableClause)
            return Object.assign(accObj, {
                [join.options.sourceProperty]:
                    (join.options.relationType === 'many-to-many' || join.options.relationType === 'one-to-one') ?
                        joinedModel.find((_: any) => true)
                        : joinedModel
            })
        }, {})
        return {
            ...model,
            ...relations,
        }
    })
    .value()