import { IFunctionQuery } from "../../domain/data/function_query";

export class FunctionQuery implements IFunctionQuery {
    and(...operands: any[]): { [key: string]: object } {
        return { $and: operands };
    }

    or(...operands: any[]): { [key: string]: object } {
        return { $or: operands };
    }

    ne(
        operand: boolean | string | number | object
    ): { [key: string]: boolean | string | number | object } {
        return { $ne: operand };
    }

    lt(
        operand: boolean | string | number | object
    ): { [key: string]: boolean | string | number | object } {
        return { $lt: operand };
    }

    lte(
        operand: boolean | string | number | object
    ): { [key: string]: boolean | string | number | object } {
        return { $lte: operand };
    }

    gt(
        operand: boolean | string | number | object
    ): { [key: string]: boolean | string | number | object } {
        return { $gt: operand };
    }

    gte(
        operand: boolean | string | number | object
    ): { [key: string]: boolean | string | number | object } {
        return { $gte: operand };
    }

    in(
        ...operands: boolean[] | string[] | number[]
    ): { [key: string]: object } {
        return { $in: operands };
    }

    inc(data: {
        [key: string]: boolean | string | number;
    }): { [key: string]: object } {
        return { $inc: data };
    }

    mul(data: {
        [key: string]: boolean | string | number;
    }): { [key: string]: object } {
        return { $mul: data };
    }

    set(data: {
        [key: string]: boolean | string | number;
    }): { [key: string]: object } {
        return { $set: data };
    }

    unset(data: {
        [key: string]: boolean | string | number;
    }): { [key: string]: object } {
        return { $unset: data };
    }
}
