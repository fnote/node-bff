/**
 * Aggregated Pricing Data Service
 *
 * @author: adis0892 on 03/08/20
 * */

import * as HttpStatus from 'http-status-codes';
import {get} from 'lodash';
import CloudPricingDataService from './cloudPricingDataService';
import ProductInfoService from '../productInfo/productInfoService';
import CustomerInfoService from '../customerInfo/customerInfoService';
import {pricingDataReqBody} from '../../validator/schema';
import logger from '../../util/logger';
import InvalidRequestException from '../../exception/invalidRequestException';
import CloudPricingDataFetchException from '../../exception/cloudPricingDataFetchException';
import {
BETWEEN, CRITICAL, INVALID_REQUEST_BODY, IS_APPLICABLE,
} from '../../util/constants';
import {getPriceSourceName} from '../../config/configs';
import {PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE} from '../../exception/exceptionCodes';

class AggregatedPricingDataService {
    /**
     * This function selects the relavant tier based on the
     * provided quantity
     * @param {*} requestBody
     * @param {*} pciPricesPayload
     */
    getApplicableTier(requestBody, pciPricesPayload) {
        const qty = requestBody.requestedQuantity;
        const volumenTiersList = get(pciPricesPayload, 'products[0].volumePricingTiers', undefined);
        const modifiedVolumeTierList = [];
        if (volumenTiersList && Object.keys(volumenTiersList).length !== 0) {
            volumenTiersList.forEach((tier) => {
                const { eligibility } = tier;
                let modifiedTier = {};
                if (eligibility.operator === BETWEEN) {
                    if (eligibility.lowerBound <= qty && qty <= eligibility.upperBound) {
                        modifiedTier = { ...tier, [IS_APPLICABLE]: true };
                    } else {
                        modifiedTier = { ...tier, [IS_APPLICABLE]: false };
                    }
                } else if (eligibility.operator === '>=') {
                    if (eligibility.lowerBound <= qty) {
                        modifiedTier = { ...tier, [IS_APPLICABLE]: true };
                    } else {
                        modifiedTier = { ...tier, [IS_APPLICABLE]: false };
                    }
                }
                modifiedVolumeTierList.push(modifiedTier);
            });
            pciPricesPayload.products[0].volumePricingTiers = modifiedVolumeTierList;
        }
        return pciPricesPayload;
    }

    getPriceSourceName(pciPricesPayload) {
        const priceSource = get(pciPricesPayload, 'products[0].priceSource', 0);
        return getPriceSourceName(priceSource);
    }

    /**
     * This function process the status section of CP request when the status code is 200
     * for errornous scenatios
     * @param  {} productPricePayload
     * @param  {} pciPricePayload
     */
    checkCPResponseErrorStatus(productPricePayload, pciPricePayload) {
        const productPayloadStatus = get(productPricePayload, 'products[0].statuses', []);
        const pciPayloadStatus = get(pciPricePayload, 'products[0].statuses', []);
        if (productPayloadStatus.length && productPayloadStatus[0].state === CRITICAL) {
            const errorMessage = `Failed to fetch data from Cloud Pricing Endpoint, ${productPayloadStatus[0].message}`;
            logger.error(`${errorMessage}`);
            throw new CloudPricingDataFetchException(
                errorMessage,
                productPayloadStatus[0].message,
                productPayloadStatus[0].code,
            );
        } else if (pciPayloadStatus.length && pciPayloadStatus[0].state === CRITICAL) {
            const errorMessage = `Failed to fetch data from Cloud Pricing Endpoint, ${pciPayloadStatus[0].message}`;
            logger.error(`${errorMessage}`);
            throw new CloudPricingDataFetchException(
                errorMessage,
                pciPayloadStatus[0].message,
                pciPayloadStatus[0].code,
            );
        }
    }

    /**
     * This function filters required data from itemInfo response
     * @param  {} itemInfoPayload
     */
    filterItemInfoData(itemInfoPayload) {
        const {
            id, name, pack, size, brandId, brand, stockIndicator, averageWeight,
            catchWeightIndicator, split, shipSplitOnly,
        } = itemInfoPayload;
        return {
            id,
            name,
            pack,
            size,
            brandId,
            brand,
            stockIndicator,
            averageWeight,
            catchWeightIndicator,
            split,
            shipSplitOnly,
        };
    }

    filterCustomerInfoData(customerInfoPayload) {
        const {
            name,
        } = customerInfoPayload;
        return {
            customerName: name,
        };
    }

    filterRootLevelPCIPricePayloadData(pciPricePayload) {
        const {
            businessUnitNumber, customerAccount, customerType, priceRequestDate, requestStatuses,
        } = pciPricePayload;
        return {
            businessUnitNumber,
            customerAccount,
            customerType,
            priceRequestDate,
            requestStatuses,
        };
    }

    async getAggregatedPricingData(req) {
        logger.info(`Received request body: ${JSON.stringify(req.body)}`);
        const requestBody = req.body;
        const { error } = pricingDataReqBody.validate(requestBody);
        if (error) {
            logger.error(`Request body validation failed in getting aggregated pricing data: ${JSON.stringify(requestBody)}`);
            throw new InvalidRequestException(
                INVALID_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
                PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE,
            );
        }

        const cloudPricingPCIDataCall = CloudPricingDataService.getCloudPricingPCIData(req);
        const cloudPricingProductPricesDataCall = CloudPricingDataService.getCloudPricingData(req);
        const itemInfoDataCall = ProductInfoService.getProductInfo(
            req.body.businessUnitNumber, req.body.product.supc,
        );
        const customerInfoDataCall = CustomerInfoService.getCustomerInfo(
            req.body.businessUnitNumber, req.body.customerAccount,
        );

        return Promise.all([
            cloudPricingPCIDataCall,
            cloudPricingProductPricesDataCall,
            itemInfoDataCall,
            customerInfoDataCall,
        ])
            .then(([cloudPricingPCIResponse, cloudPricingProductPricesResponse, itemCallResponse, customerCallResponse]) => {
                let finalResponse = {};
                const productPricePayload = cloudPricingProductPricesResponse.data;
                const pciPricePayload = cloudPricingPCIResponse.data;
                const itemInfoPayload = itemCallResponse.data;
                const customerInfoPayload = customerCallResponse.data;
                // validating CP responses
                this.checkCPResponseErrorStatus(productPricePayload, pciPricePayload);

                // selecting tiers from product-prices and tag applicable tier
                const modifiedCloudPricingProductPricesResponse = this.getApplicableTier(requestBody, productPricePayload);
                const modifiedVolumeTiers = get(modifiedCloudPricingProductPricesResponse, 'products[0].volumePricingTiers', []);

                // selecting price source name
                const priceSourceName = this.getPriceSourceName(pciPricePayload);

                // filtering item info data
                const filteredItemPayload = this.filterItemInfoData(itemInfoPayload);

                const filteredCustomerPayload = this.filterCustomerInfoData(customerInfoPayload);

                // filtering root level attributes in pci-prices data
                const rootLevelData = this.filterRootLevelPCIPricePayloadData(pciPricePayload);

                // adding root level data to final response
                finalResponse = { ...rootLevelData, ...filteredCustomerPayload };
                // building product section
                finalResponse.product = {
                    ...filteredItemPayload,
                    priceSourceName,
                    ...pciPricePayload.products[0],
                    volumePricingTiers: [...modifiedVolumeTiers],
                };
                return finalResponse;
            })
            .catch((err) => {
                logger.error(`Error occurred in while processing aggregated pricing data: ${err}`);
                throw err;
            });
    }
}

export default new AggregatedPricingDataService();
