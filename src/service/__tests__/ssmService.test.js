/**
 * SSM Service unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */
import sinon from 'sinon';
import {getSsmConfig, loadSsmConfigs, ssmClient} from '../aws/ssmService';

const paramName = 'ApiCentralAuthorizationToken';
const paramValue = 'mockParamValue';
const stub = sinon.stub(ssmClient, 'getParametersByPath');
const ssmResponse = {
    Parameters: [
        {
            Name: '/CP/CLOUD-PCI/undefined/APICENTRAL/ACCESSKEY',
            Type: 'String',
            Value: paramValue,
            Version: 1,
        },
        {
            Name: 'mock name',
            Type: 'String',
            Value: 'mock value',
            Version: 1,
        },
    ],
};

describe('SSM Service', () => {
    test('should return token value  when the the token param name is given', async () => {
        const promiseStub = sinon.stub().resolves(ssmResponse);
        stub.callsFake(() => ({
            promise: promiseStub,
        }));
        await loadSsmConfigs();
        const val = await getSsmConfig(paramName);
        expect(val).toEqual(paramValue);
        sinon.assert.calledWithMatch(ssmClient.getParametersByPath, {
            Path: '/CP/CLOUD-PCI/undefined',
            Recursive: true,
            WithDecryption: true,
        });
        sinon.assert.calledOnce(promiseStub);
    });

    test('should throw exception when the the param name is invalid', async () => {
        const promiseStub = sinon.stub().resolves(ssmResponse);
        stub.callsFake(() => ({
            promise: promiseStub,
        }));
        await loadSsmConfigs();
        expect(() => getSsmConfig('')).rejects.toThrowError(new Error('configuration key  not found'));
        sinon.assert.calledWithMatch(ssmClient.getParametersByPath, {
            Path: '/CP/CLOUD-PCI/undefined',
            Recursive: true,
            WithDecryption: true,
        });
        sinon.assert.calledOnce(promiseStub);

    });
});
