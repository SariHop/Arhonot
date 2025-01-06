import { add } from "../services/testServices";

describe("add function", () => {
test("add",()=> {
    const result  = add(1,2);

    expect(result).toBe(3);
    });
})