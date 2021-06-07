import { FindAttributeQuery, IncludeQuery } from './include/include-options'
import { WhereQuery } from './where/where-options'

export interface Filterable<T> {
    where?: WhereQuery<T>
}

export interface Portionable<T> {
    attributes?: FindAttributeQuery<T>
}

export interface Findable<T>
    extends Filterable<T>, Portionable<T> {
    include?: IncludeQuery<T>[]
    
    take?: number

    skip?: number
}
