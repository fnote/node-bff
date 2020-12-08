/**
 * customer Info Service
 *
 * @author: sthe3935 on 05/08/20
 * */

import { getCustomerInfoApiConfig } from '../../config/configs';
import ApiCentralClient from '../../httpClient/apiCentralClient';
import logger from '../../util/logger';
import CustomerInfoDataFetchException from '../../exception/customerInfoDataFetchException';
import { CUSTOMER_INFO_DATA_FETCH_ERROR_CODE } from '../../exception/exceptionCodes';

class CustomerInfoService {
    constructor() {
        this.customerInfoApiConfig = getCustomerInfoApiConfig();
    }

    async getCustomerInfo(businessUnit, customerAccount) {
        try {
            return await ApiCentralClient.get(
                this.generateCustomerInfoRequestUrl(businessUnit, customerAccount),
            );
        } catch (e) {
            const errorMessage = 'Failed to fetch data from Customer Info API';
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
            throw new CustomerInfoDataFetchException(
                e,
                errorMessage,
                CUSTOMER_INFO_DATA_FETCH_ERROR_CODE,
            );
        }
    }

    generateCustomerInfoRequestUrl(businessUnit, customerAccount) {
        return `${this.customerInfoApiConfig.CONFIG.customerInfoApiUrl}/opcos/${businessUnit}/customers/${customerAccount}`;
    }
}

export default new CustomerInfoService();
