/**
 * SSM Service unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */
import sinon from 'sinon';
import {
    getSsmConfig, getSsmConfigSync, loadSsmConfigs, ssmClient,
} from '../aws/ssmService';

const paramName = 'ApiCentralAuthorizationToken';
const paramValue = 'mockParamValue';
const stub = sinon.stub(ssmClient, 'getParameters');

const ACCESS_KEY_PARAM_NAME = '/CP/CLOUD-PCI/undefined/APICENTRAL/ACCESSKEY';
const DB_URL_PARAM_NAME = '/CP/CLOUD-PCI/undefined/DATABASE/COMMON/DB_URL';
const PASSWORD_PARAM_NAME = '/CP/CLOUD-PCI/undefined/DATABASE/COMMON/PASSWORD';
const USER_NAME_PARAM_NAME = '/CP/CLOUD-PCI/undefined/DATABASE/COMMON/USERNAME';
const SEED_API_HOST_PARAM_NAME = '/CP/CIPZ_SERVICE/undefined/SEED/API/HOST';

const PARAM_NAMES = [
    ACCESS_KEY_PARAM_NAME,
    DB_URL_PARAM_NAME,
    PASSWORD_PARAM_NAME,
    USER_NAME_PARAM_NAME,
    SEED_API_HOST_PARAM_NAME,
];

const ssmResponse = {
    Parameters: [
        {
            Name: ACCESS_KEY_PARAM_NAME,
            Type: 'String',
            Value: paramValue,
            Version: 1,
        },
        {
            Name: DB_URL_PARAM_NAME,
            Type: 'String',
            Value: 'localhost:3306',
            Version: 1,
        },
        {
            Name: PASSWORD_PARAM_NAME,
            Type: 'String',
            Value: 'mockedPassword',
            Version: 1,
        },
        {
            Name: USER_NAME_PARAM_NAME,
            Type: 'String',
            Value: 'mockedUsername',
            Version: 1,
        },
        {
            Name: SEED_API_HOST_PARAM_NAME,
            Type: 'String',
            Value: 'http://localhost:3000',
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
        const valSync = getSsmConfigSync(paramName);
        expect(valSync).toEqual(paramValue);
        sinon.assert.calledWithMatch(ssmClient.getParameters, {
            Names: PARAM_NAMES,
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
        sinon.assert.calledWithMatch(ssmClient.getParameters, {
            Names: PARAM_NAMES,
            WithDecryption: true,
        });
        sinon.assert.calledOnce(promiseStub);
    });
});
