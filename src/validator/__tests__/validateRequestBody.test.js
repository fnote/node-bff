/**
 * Request Body Validator unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */

import * as HttpStatus from "http-status-codes";
import validateRequestBody from "../validateRequestBody";
import InvalidRequestException from "../../exception/invalidRequestException";
import {ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY} from "../../util/constants";

const validRequestBody = {
    fileNames: [
        "fileName1",
        "fileName2",
    ],
};

const inValidRequestBody1 = {
    fileNames: "",
};

const inValidRequestBody2 = {};

describe("Request Body Validator", () => {
    test("should return nothing when the request body is valid", async () => {
        expect(() => validateRequestBody(validRequestBody)).not
            .toThrowError(new InvalidRequestException(
                ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test("should throw InvalidRequestException when the request body is inValid", async () => {
        expect(() => validateRequestBody(inValidRequestBody1))
            .toThrowError(new InvalidRequestException(
                ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test("should throw InvalidRequestException when the request body is empty", async () => {
        expect(() => validateRequestBody(inValidRequestBody2))
            .toThrowError(new InvalidRequestException(
                ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });
});
