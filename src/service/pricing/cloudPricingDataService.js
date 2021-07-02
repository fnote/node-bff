/**
 * Cloud Pricing Data Service
 *
 * @author: adis0892 on 03/08/20
 * */

import {getCloudPricingConfig} from '../../config/configs';
import {httpClient} from '../../httpClient/httpClient';
import logger from '../../util/logger';
import CloudPricingDataFetchException from '../../exception/cloudPricingDataFetchException';
import { getCorrelationId } from '../../util/correlationIdGenerator';
import {
    HTTP_POST, ERROR_IN_FETCHING_CLOUD_PRICING_DATA,
    APPLICATION_JSON, CORRELATION_ID_HEADER, ORDER_PRICE_TYPE_HAND,
} from '../../util/constants';
import ApiCentralClient from "../../httpClient/apiCentralClient";

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
                { ...req.body.product },
            ],
        };
        const headers = {
            clientID: this.cloudPricingConfig.CONFIG.clientId,
            priceEngineType: this.cloudPricingConfig.CONFIG.priceEngineType,
            [CORRELATION_ID_HEADER]: getCorrelationId(),
        };

        const reqUrl = this.cloudPricingConfig.CONFIG.cloudPricingApiCentralBaseUrl
            + this.cloudPricingConfig.CONFIG.productPricesEndpoint;

        return this.sendRequest(reqUrl, headers, body);
    }

    async getCloudPricingPCIData(req) {
        const reqBody = req.body;

        const body = {
            businessUnitNumber: `${reqBody.businessUnitNumber}`,
            customerAccount: `${reqBody.customerAccount}`,
            priceRequestDate: `${reqBody.priceRequestDate}`,
        };

        const product = { ...reqBody.product, quantity: `${reqBody.requestedQuantity}` };

        if (reqBody.orderPrice) {
            product.orderPrice = reqBody.orderPrice;
            product.orderPriceType = reqBody.orderPriceType ? reqBody.orderPriceType : ORDER_PRICE_TYPE_HAND;
        }

        body.products = [product];

        logger.debug(`Request to PCI-Prices: ${JSON.stringify(body)}`);

        const headers = {
            clientID: this.cloudPricingConfig.CONFIG.clientId,
            priceEngineType: this.cloudPricingConfig.CONFIG.priceEngineType,
            [CORRELATION_ID_HEADER]: getCorrelationId(),
        };

        const reqUrl = this.cloudPricingConfig.CONFIG.cloudPricingApiCentralBaseUrl
            + this.cloudPricingConfig.CONFIG.pciPricesEndpoint;

        return this.sendRequest(reqUrl, headers, body);
    }

    async sendRequest(reqUrl, headers, body) {
        try {
            return await ApiCentralClient.post(
                reqUrl, body, headers,
            );
        } catch (e) {
            const specificErrorMessage = e.errorDetails.response.data.message;
            const errorMessage = `${ERROR_IN_FETCHING_CLOUD_PRICING_DATA}, ${specificErrorMessage}`;
            logger.error(`${errorMessage} ${reqUrl} due to: ${e}, stacktrace: ${e.stack}`);
            const cpErrorCode = e.errorDetails.response.data.code;
            throw new CloudPricingDataFetchException(
                errorMessage,
                e.message,
                cpErrorCode,
            );
        }
    }
}

export default new CloudPricingDataService();
