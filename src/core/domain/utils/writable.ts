// This will allow you to change readonly properties

export type Writable<T> = {
    -readonly [K in keyof T]: T[K];
};
