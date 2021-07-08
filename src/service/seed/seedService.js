import {getSeedApiConfig, getSeedApiBaseUrl} from '../../config/configs';
import SeedApiDataFetchException from '../../exception/seedApiDataFechException';
// constants
import {
    UNKNOWN_SEED_API_ERROR_MESSAGE,
    GENERIC_SEED_API_ERROR_MESSAGE,
} from '../../util/constants';
import {UNKNOWN_SEED_API_ERROR, UNKNOWN_SEED_API_CAUGHT_ERROR} from '../../exception/exceptionCodes';

import ApiCentralClient from '../../httpClient/apiCentralClient';

class SeedService {
    constructor() {
        this.seedApiConfig = getSeedApiConfig();
    }

    generateRequestConfigs() {
        return {
            timeout: this.seedApiConfig.CONFIG.timeout,
            baseURL: getSeedApiBaseUrl(),
        };
    }

    static handleError(error) {
        if (error && error.response && error.response.data) {
            const errorData = error.response.data;
            const errorCode = Number(errorData.code);
            const errorMesssage = errorData.message ? errorData.message : GENERIC_SEED_API_ERROR_MESSAGE;
            if (errorCode) {
                throw new SeedApiDataFetchException(error, errorMesssage, errorCode);
            }
            throw new SeedApiDataFetchException(error, UNKNOWN_SEED_API_ERROR_MESSAGE, UNKNOWN_SEED_API_ERROR);
        }
        throw new SeedApiDataFetchException(error, UNKNOWN_SEED_API_ERROR_MESSAGE, UNKNOWN_SEED_API_CAUGHT_ERROR);
    }

    async getSeedItemAttributeGroupsData() {
        const reqUrl = this.seedApiConfig.CONFIG.getItemAttributeGroupsEndpoint;
        try {
            const response = await ApiCentralClient.get(reqUrl, null, this.generateRequestConfigs());
            return response;
        } catch (error) {
            return SeedService.handleError(error);
        }
    }

    async getPriceZoneDetailsForCustomerAndItemAttributeGroup(req) {
        const reqUrl = this.seedApiConfig.CONFIG.getCustomerAndItemAttributeGroupsEndpoint;
        try {
            const response = await ApiCentralClient.post(reqUrl, req.body, null, this.generateRequestConfigs());
            return response;
        } catch (error) {
            return SeedService.handleError(error);
        }
    }

    async getPriceZoneDetailsForCustomerGroupAndItemAttributeGroup(req) {
        const reqUrl = this.seedApiConfig.CONFIG.getCustomerGroupAndItemAttributeGroupsEndpoint;
        try {
            const response = await ApiCentralClient.post(reqUrl, req.body, null, this.generateRequestConfigs());
            return response;
        } catch (error) {
            return SeedService.handleError(error);
        }
    }
}

export default new SeedService();
