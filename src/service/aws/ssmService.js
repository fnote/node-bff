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

export async function loadSsmConfigs() {
    logger.info('initializing: ');
    const params = {
        Path: configBaseURL,
        Recursive: true,
        WithDecryption: true,
    };
    const response = await ssmClient.getParametersByPath(params).promise();
    response.Parameters.forEach((element) => {
        if (element.Name === `${configBaseURL}/APICENTRAL/ACCESSKEY`) {
            values.ApiCentralAuthorizationToken = element.Value;
        } else if (element.Name === `${configBaseURL}/DATABASE/COMMON/DB_URL`) {
            values.commonDbURL = element.Value;
        } else if (element.Name === `${configBaseURL}/DATABASE/COMMON/PASSWORD`) {
            values.commonDbPassword = element.Value;
        } else if (element.Name === `${configBaseURL}/DATABASE/COMMON/USERNAME`) {
            values.commonDbUsername = element.Value;
        }
    });
    return values;
}

export const getSsmConfig = async (key) => {
    if (values[key]) {
        return values[key];
    }
    const msg = `configuration key ${key} not found`;
    throw new Error(msg);
};
