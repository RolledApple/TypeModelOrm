import Op from "./repository/options/operators"

// const operatorsSet = new Set<string>(['and', 'or'])
const operatorsSet = new Set(Object.values(Op))
// console.log('kek: ', kek)

export const getOperators = (obj: any) =>{
    console.log(Object.getOwnPropertyNames(obj))
    Object.getOwnPropertyNames(obj)
        .filter(s => operatorsSet.has(s))}

// export const getComplexKeys = (obj: any) =>
//     getOperators(obj).concat(Object.keys(obj))

export const getNotOperatorsKeys = (obj: any) =>
    Object.getOwnPropertyNames(obj)
        .filter(s => !operatorsSet.has(s))

export const isPrimitive = (obj: any) => 
    obj !== Object(obj)