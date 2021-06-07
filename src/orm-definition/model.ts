export abstract class Model<TModelProperties extends {} = any,
    TModelCreationProperties extends {} = TModelProperties>
{
    _modelProperties: TModelProperties
    _modelCreationProperties: TModelCreationProperties
}
