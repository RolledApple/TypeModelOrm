import { ModelTarget } from "../../repository"
import { Portionable } from "../options"
import { Model } from "../../../orm-definition/model"

export type FindAttributeQuery<T> =
    | {
        exclude?: string[],
        include: string[],
    }
    | {
        exclude: string[],
        include?: string[],
    }

export interface IncludeQuery<T> extends Portionable<T> {
    model: ModelTarget<Model>
    include?: IncludeQuery<T>[]
}