export interface IFunctionQuery {
    // Query operators

    and(...operands: any[]): { [key: string]: object };

    or(...operands: any[]): { [key: string]: object };

    ne(
        operand: boolean | string | number | object
    ): { [key: string]: boolean | string | number | object };

    lt(
        operand: boolean | string | number | object
    ): { [key: string]: boolean | string | number | object };

    lte(
        operand: boolean | string | number | object
    ): { [key: string]: boolean | string | number | object };

    gt(
        operand: boolean | string | number | object
    ): { [key: string]: boolean | string | number | object };

    gte(
        operand: boolean | string | number | object
    ): { [key: string]: boolean | string | number | object };

    in(...operands: any[]): { [key: string]: object };

    // Update Operators

    inc(data: {
        [key: string]: boolean | string | number | object;
    }): { [key: string]: object };

    mul(data: {
        [key: string]: boolean | string | number | object;
    }): { [key: string]: object };

    set(data: {
        [key: string]: boolean | string | number | object;
    }): { [key: string]: object };

    unset(data: {
        [key: string]: boolean | string | number | object;
    }): { [key: string]: object };
}
