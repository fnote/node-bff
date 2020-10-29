/**
 * Cloud Pricing Data Service
 *
 * @author: adis0892 on 03/08/20
 * */

import {getCloudPricingConfig} from '../../config/configs';
import {httpClient} from '../../httpClient/httpClient';
import logger from '../../util/logger';
import CloudPricingDataFetchException from '../../exception/cloudPricingDataFetchException';
import { HTTP_POST, ERROR_IN_FETCHING_CLOUD_PRICING_DATA, APPLICATION_JSON } from '../../util/constants';
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
            'Content-type': APPLICATION_JSON,
            Accept: APPLICATION_JSON,
            clientID: this.cloudPricingConfig.CONFIG.clientId,
            priceEngineType: this.cloudPricingConfig.CONFIG.priceEngineType,
        };

        let reqUrl = this.cloudPricingConfig.CONFIG.cloudPricingBaseUrl + this.cloudPricingConfig.CONFIG.productPricesEndpoint;

        try {
            return await httpClient.makeRequest(
                HTTP_POST, reqUrl, body, headers,
            );
        } catch (e) {
            const errorMessage = ERROR_IN_FETCHING_CLOUD_PRICING_DATA;
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
            'Content-type': APPLICATION_JSON,
            Accept: APPLICATION_JSON,
            clientID: this.cloudPricingConfig.CONFIG.clientId,
            priceEngineType: this.cloudPricingConfig.CONFIG.priceEngineType,
        };

        let reqUrl = this.cloudPricingConfig.CONFIG.cloudPricingBaseUrl + this.cloudPricingConfig.CONFIG.pciPricesEndpoint;

        try {
            return await httpClient.makeRequest(
                HTTP_POST, reqUrl, body, headers,
            );
        } catch (e) {
            const errorMessage = ERROR_IN_FETCHING_CLOUD_PRICING_DATA;
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
