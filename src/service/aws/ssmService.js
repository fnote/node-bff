/**
 * SSM service class
 *
 * @author: gkar5861 on 04/06/20
 * */

import AWS from 'aws-sdk';
import logger from '../../util/logger';
import {AWS_REGION} from '../../util/constants';

export const ssmClient = new AWS.SSM({
    region: AWS_REGION,
});

const values = {};
const configBaseURL = `/CP/CLOUD-PCI/${process.env.STAGE}`;

const CLOUD_PCI_SSM_PARAMS = [
    { paramName: `${configBaseURL}/APICENTRAL/ACCESSKEY`, readableConfigName: 'ApiCentralAuthorizationToken' },
    { paramName: `${configBaseURL}/DATABASE/COMMON/DB_URL`, readableConfigName: 'commonDbURL' },
    { paramName: `${configBaseURL}/DATABASE/COMMON/PASSWORD`, readableConfigName: 'commonDbPassword' },
    { paramName: `${configBaseURL}/DATABASE/COMMON/USERNAME`, readableConfigName: 'commonDbUsername' },
];

const SHARED_SSM_PARAMS = [
    { paramName: `/CP/CIPZ_SERVICE/${process.env.STAGE}/SEED/API/HOST`, readableConfigName: 'seedApiHost' },
];

const REQUIRED_SSM_PARAMS = [
    ...CLOUD_PCI_SSM_PARAMS,
    ...SHARED_SSM_PARAMS,
];

const getSSMParamNames = () => REQUIRED_SSM_PARAMS.map(({paramName}) => paramName);

export async function loadSsmConfigs() {
    logger.info('initializing: ');
    const params = {
        Names: getSSMParamNames(),
        WithDecryption: true,
    };
    const response = await ssmClient.getParameters(params).promise();
    response.Parameters.forEach(({Name, Value}) => {
        logger.info(`${Name}: ${Value}`);
        const { readableConfigName } = REQUIRED_SSM_PARAMS.find(({ paramName }) => paramName === Name);
        values[readableConfigName] = Value;
    });
    return values;
}

export const getSsmConfigSync = (key) => {
    if (values[key]) {
        return values[key];
    }
    const msg = `configuration key ${key} not found`;
    throw new Error(msg);
};

export const getSsmConfig = async (key) => getSsmConfigSync(key);
