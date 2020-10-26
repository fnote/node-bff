/**
 * Cloud Pricing Data Service
 *
 * @author: adis0892 on 03/08/20
 * */

import {getCloudPricingConfig} from '../../config/configs';
import {httpClient} from '../../httpClient/httpClient';
import logger from '../../util/logger';
import CloudPricingDataFetchException from '../../exception/cloudPricingDataFetchException';
import {HTTP_POST} from '../../util/constants';
import { PCI_PRICE_DATA_FETCH_ERROR_CODE, PRODUCT_PRICE_DATA_FETCH_ERROR_CODE } from '../../exception/exceptionCodes';

class CloudPricingDataService {
    constructor() {
        this.cloudPricingConfig = getCloudPricingConfig();
    }

    async getCloudPricingData(req) {
        const body = {
            businessUnitNumber: `${req.body.businessUnitNumber}`,
            customerAccount: `${req.body.customerAccount}`,
            priceRequestDate: `${req.body.priceRequestDate}`,
            products: [
                { ...req.body.product }
            ],
        };

        const headers = {
            'Content-type': 'application/json',
            Accept: 'application/json',
            clientID: this.cloudPricingConfig.CONFIG.clientId,
            priceEngineType: this.cloudPricingConfig.CONFIG.priceEngineType,
        };

        let reqUrl = this.cloudPricingConfig.CONFIG.cloudPricingBaseUrl + this.cloudPricingConfig.CONFIG.productPricesEndpoint;

        try {
            return await httpClient.makeRequest(
                HTTP_POST, reqUrl, body, headers,
            );
        } catch (e) {
            const errorMessage = `Failed to fetch data from Cloud Pricing Endpoint`;
            logger.error(`${errorMessage} ${reqUrl} due to: ${e}, stacktrace: ${e.stack}`);
            throw new CloudPricingDataFetchException(
                errorMessage,
                e.message,
                PRODUCT_PRICE_DATA_FETCH_ERROR_CODE
            );
        }
    }

    async getCloudPricingPCIData(req) {
        const body = {
            businessUnitNumber: `${req.body.businessUnitNumber}`,
            customerAccount: `${req.body.customerAccount}`,
            priceRequestDate: `${req.body.priceRequestDate}`,
            products: [
                { ...req.body.product, quantity: `${req.body.requestedQuantity}` }
            ],
        };
        const headers = {
            'Content-type': 'application/json',
            Accept: 'application/json',
            clientID: this.cloudPricingConfig.CONFIG.clientId,
            priceEngineType: this.cloudPricingConfig.CONFIG.priceEngineType,
        };

        let reqUrl = this.cloudPricingConfig.CONFIG.cloudPricingBaseUrl + this.cloudPricingConfig.CONFIG.pciPricesEndpoint;

        try {
            return await httpClient.makeRequest(
                HTTP_POST, reqUrl, body, headers,
            );
        } catch (e) {
            const errorMessage = `Failed to fetch data from Cloud Pricing Endpoint`;
            logger.error(`${errorMessage} ${reqUrl} due to: ${e}, stacktrace: ${e.stack}`);
            throw new CloudPricingDataFetchException(
                errorMessage,
                e.message,
                PCI_PRICE_DATA_FETCH_ERROR_CODE
            );
        }
    }
}

export default new CloudPricingDataService();
