/**
 * Batch route unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */
import sinon from "sinon";
import {getParameterValueByName, ssmClient} from "../aws/ssmService";

const paramName = "paramName";
const paramValue = "paramValue";
describe("SSM Service", () => {
    test("should return param value  when the the param name is given", async () => {
        const promiseStub = sinon.stub().resolves({Parameter: {Value: paramValue}});
        sinon.stub(ssmClient, "getParameter").callsFake(() => ({
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
});
