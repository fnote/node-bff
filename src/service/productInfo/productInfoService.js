/**
 * Product Info Service
 *
 * @author: cwic0864 on 05/08/20
 * */

import {getProductInfoApiConfig} from '../../config/configs';
import ApiCentralClient from '../../httpClient/apiCentralClient';
import logger from '../../util/logger';
import ProductInfoDataFetchException from '../../exception/productInfoDataFetchException';
import { PRODUCT_INFO_DATA_FETCH_ERROR_CODE } from '../../exception/exceptionCodes';
class ProductInfoService {
    constructor() {
        this.procdutInfoApiConfig = getProductInfoApiConfig();
    }

    async getProductInfo(businessUnit, supc) {
        try {
            return await ApiCentralClient.get(
                this.generateProductInfoRequestUrl(businessUnit, supc),
            );
        } catch (e) {
            const errorMessage = 'Failed to fetch data from Product Info API';
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
            throw new ProductInfoDataFetchException(
                e,
                errorMessage,
                PRODUCT_INFO_DATA_FETCH_ERROR_CODE
            );
        }
    }

    generateProductInfoRequestUrl(businessUnit, supc) {
        return `${this.procdutInfoApiConfig.CONFIG.productInfoApiUrl}/opcos/${businessUnit}/products/${supc}`;
    }
}

export default new ProductInfoService();
