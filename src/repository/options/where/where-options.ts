import Op from '../operators'

export type WhereValue<T = any> =
    | string
    | number
    | boolean
    | Date
    | null
    | OrOperator<T>
    | AndOperator<T>
    | NotOperator<T>
    | GreaterThanOperator
    | GreaterThanEqualOperator
    | LighterThanOperator
    | LighterEqualThanOperator
    | EqualOperator
    | NotEqualOperator
    | LikeOperator


export type WhereAttributeStructure<T = any> = {
    [field in keyof T]?: WhereValue<T>
}

export type WhereQuery<T = any> =
    | WhereAttributeStructure<T>
    | OrOperator<T>
    | AndOperator<T>
    | NotOperator<T>

export interface OrOperator<T = any> {
    [Op.or]: WhereQuery<T> |  WhereValue<T> 
}

export interface AndOperator<T = any> {
    [Op.and]: WhereQuery<T> | WhereValue<T> 
}

export interface NotOperator<T = any> {
    [Op.not]: WhereQuery<T> | WhereValue<T> 
}

export type ComparisonValue =
    | string
    | number
    | boolean
    | Date

export type EqualityValue = 
    | ComparisonValue
    | null

export interface GreaterThanOperator {
    [Op.gt]: ComparisonValue
}

export interface GreaterThanEqualOperator {
    [Op.gte]: ComparisonValue
}

export interface LighterThanOperator {
    [Op.lt]: ComparisonValue
}

export interface LighterEqualThanOperator {
    [Op.lte]: ComparisonValue
}

export interface EqualOperator {
    [Op.eq]: EqualityValue
}

export interface NotEqualOperator {
    [Op.neq]: EqualityValue
}

export interface LikeOperator {
    [Op.like]: string
}