/**
 * Batch route unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */
import sinon from "sinon";
import {getParameterValueByName, ssmClient} from "../aws/ssmService";

const paramName = "paramName";
const paramValue = "paramValue";
const stub = sinon.stub(ssmClient, "getParameter");

describe("SSM Service", () => {
    test("should return param value  when the the param name is given", async () => {
        const promiseStub = sinon.stub().resolves({data: paramValue});
        stub.callsFake(() => ({
            promise: promiseStub,
        }));
        const val = await getParameterValueByName(paramName);
        expect(val).toEqual(paramValue);
        sinon.assert.calledWithExactly(ssmClient.getParameter, {
            Name: paramName,
            Recursive: true,
            WithDecryption: true,
        });
        sinon.assert.calledOnce(promiseStub);
    });

    test("should throw exception when the the param name is invalid", async () => {
        const promiseStubError = sinon.stub().throws(new Error());
        stub.callsFake(() => ({
            promise: promiseStubError,
        }));
        expect(() => getParameterValueByName("")).rejects.toThrowError(new Error("Error"));
        sinon.assert.calledWithExactly(ssmClient.getParameter, {
            Name: "",
            Recursive: true,
            WithDecryption: true,
        });
        sinon.assert.calledOnce(promiseStubError);
    });
});
