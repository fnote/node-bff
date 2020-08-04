/**
 * Cloud Pricing Data Service
 *
 * @author: adis0892 on 03/08/20
 * */

import {getCloudPricingConfig} from "../../config/configs";
import HttpClient from "../../httpClient/httpClient";
import logger from "../../util/logger";
import CloudPricingDataFetchException from "../../exception/cloudPricingDataFetchException";

class CloudPricingDataService {
    constructor() {
        this.cloudPricingConfig = getCloudPricingConfig();
    }

    getCloudPricingData = async (req) => {


        const body = {
            "businessUnitNumber": `${req.body.businessUnitNumber}`,
            "customerAccount": `${req.body.customerAccount}`,
            "priceRequestDate": `${req.body.priceRequestDate}`,
            "products": [
                ...req.body.products
            ]
        };

        const headers = {
            "Content-type": "application/json",
            "Accept": "application/json",
            "clientID": this.cloudPricingConfig.CONFIG.clientId,
            "priceEngineType": this.cloudPricingConfig.CONFIG.priceEngineType
        }

        try {
            return await HttpClient.makeRequest(HTTP_POST, this.cloudPricingConfig.CONFIG.cloudPricingUrl, body, headers);
        } catch (e) {
            const errorMessage = 'Failed to fetch data from Cloud Pricing Endpoint';
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
            throw new CloudPricingDataFetchException(
                errorMessage,
                e.message
            );
        }
    }
}

export default new CloudPricingDataService();
