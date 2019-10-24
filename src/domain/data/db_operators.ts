import { iocContainer } from "../../infrastructure/config/ioc";
import { TYPES } from "../constants/types";
import { IFunctionQuery } from "./function_query";

export const and = (...operands: any[]) => {
    const functionQuery = iocContainer.get<IFunctionQuery>(TYPES.FunctionQuery);
    return functionQuery.and(...operands);
};

export const or = (...operands: any[]) => {
    const functionQuery = iocContainer.get<IFunctionQuery>(TYPES.FunctionQuery);
    return functionQuery.or(...operands);
};

export const ne = (operand: any) => {
    const functionQuery = iocContainer.get<IFunctionQuery>(TYPES.FunctionQuery);
    return functionQuery.ne(operand);
};

export const lt = (operand: any) => {
    const functionQuery = iocContainer.get<IFunctionQuery>(TYPES.FunctionQuery);
    return functionQuery.lt(operand);
};

export const lte = (operand: any) => {
    const functionQuery = iocContainer.get<IFunctionQuery>(TYPES.FunctionQuery);
    return functionQuery.lte(operand);
};

export const gt = (operand: any) => {
    const functionQuery = iocContainer.get<IFunctionQuery>(TYPES.FunctionQuery);
    return functionQuery.lt(operand);
};

export const gte = (operand: any) => {
    const functionQuery = iocContainer.get<IFunctionQuery>(TYPES.FunctionQuery);
    return functionQuery.gte(operand);
};

export const isIn = (...operands: any[]) => {
    const functionQuery = iocContainer.get<IFunctionQuery>(TYPES.FunctionQuery);
    return functionQuery.in(...operands);
};

export const inc = (data: { [key: string]: number }) => {
    const functionQuery = iocContainer.get<IFunctionQuery>(TYPES.FunctionQuery);
    return functionQuery.inc(data);
};

export const mul = (data: { [key: string]: number }) => {
    const functionQuery = iocContainer.get<IFunctionQuery>(TYPES.FunctionQuery);
    return functionQuery.mul(data);
};

export const set = (data: {
    [key: string]: boolean | string | number | object;
}) => {
    const functionQuery = iocContainer.get<IFunctionQuery>(TYPES.FunctionQuery);
    return functionQuery.set(data);
};

export const unset = (data: {
    [key: string]: boolean | string | number | object;
}) => {
    const functionQuery = iocContainer.get<IFunctionQuery>(TYPES.FunctionQuery);
    return functionQuery.unset(data);
};
