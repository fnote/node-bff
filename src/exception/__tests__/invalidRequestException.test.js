/**
 * Invalid Request Exception unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */
import * as HttpStatus from "http-status-codes";
import InvalidRequestException from "../invalidRequestException";

describe("Invalid Request Exception", () => {
    test("should return -1 as the error status when the error doesnt have a response body", async () => {
        const invalidRequestException = new InvalidRequestException("error");
        expect(invalidRequestException.message).toEqual("error");
        expect(invalidRequestException.getStatus()).toEqual(-1);
    });

    test("should return the status that provided in the error", async () => {
        const invalidRequestException = new InvalidRequestException("error", HttpStatus.BAD_REQUEST);
        expect(invalidRequestException.message).toEqual("error");
        expect(invalidRequestException.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    });
});
