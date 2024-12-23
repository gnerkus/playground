import { cc } from "bun:ffi";

export const {
    symbols: { num },
} = cc({
    source: "./hello.c",
    include: [
        "C:\\Program Files\\tcc",
        "C:\\Program Files\\tcc\\include",
        "C:\\Program Files\\tcc\\lib"
    ],
    symbols: {
        num: {
            returns: "int",
            args: [],
        },
    },
});

console.log(num())