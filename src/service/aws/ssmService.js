/**
 * SSM service class
 *
 * @author: gkar5861 on 04/06/20
 * */

import AWS from "aws-sdk";
import logger from "../../util/logger";
import {AWS_REGION} from "../../util/constants";

export const ssmClient = new AWS.SSM({
    region: AWS_REGION,
});

export async function getParameterValueByName(paramName) {
    const params = {
        Name: paramName,
        Recursive: true,
        WithDecryption: true,
    };

    try {
        const response = await ssmClient.getParameter(params).promise();
        return response && response.Parameter ? response.Parameter.Value : null;
    } catch (error) {
        logger.error(error);
        throw new Error(error);
    }
}
