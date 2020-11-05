/**
 * Aggregated Pricing Data Service
 *
 * @author: adis0892 on 03/08/20
 * */

import * as HttpStatus from 'http-status-codes';
import { get } from 'lodash';
import CloudPricingDataService from './cloudPricingDataService';
import ProductInfoService from '../productInfo/productInfoService';
import { pricingDataReqBody } from '../../validator/schema';
import logger from '../../util/logger';
import InvalidRequestException from '../../exception/invalidRequestException';
import CloudPricingDataFetchException from '../../exception/cloudPricingDataFetchException';
import {
    ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY, BETWEEN, IS_APPLICABLE, CRITICAL,
} from '../../util/constants';
import { getPriceSourceName } from '../../config/configs';
import { PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE } from '../../exception/exceptionCodes';

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
        const filteredItemPayload = {};
        filteredItemPayload.id = id;
        filteredItemPayload.name = name;
        filteredItemPayload.pack = pack;
        filteredItemPayload.size = size;
        filteredItemPayload.brandId = brandId;
        filteredItemPayload.brand = brand;
        filteredItemPayload.stockIndicator = stockIndicator;
        filteredItemPayload.averageWeight = averageWeight;
        filteredItemPayload.catchWeightIndicator = catchWeightIndicator;
        filteredItemPayload.split = split;
        filteredItemPayload.shipSplitOnly = shipSplitOnly;
        return filteredItemPayload;
    }

    filterRootLevelPCIPricePayloadData(pciPricePayload) {
        const {
            businessUnitNumber, customerAccount, customerType, priceRequestDate, requestStatuses,
        } = pciPricePayload;
        const rootLevelData = {};
        rootLevelData.businessUnitNumber = businessUnitNumber;
        rootLevelData.customerAccount = customerAccount;
        rootLevelData.customerType = customerType;
        rootLevelData.priceRequestDate = priceRequestDate;
        rootLevelData.requestStatuses = requestStatuses;
        return rootLevelData;
    }

    async getAggregatedPricingData(req) {
        const requestBody = req.body;
        const { error } = pricingDataReqBody.validate(requestBody);
        if (error) {
            logger.error(`Request body validation failed in getting aggregated pricing data: 
                ${JSON.stringify(requestBody)}`);
            throw new InvalidRequestException(
                ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
                PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE,
            );
        }

        const cloudPricingPCIDataCall = CloudPricingDataService.getCloudPricingPCIData(req);
        const cloudPricingProductPricesDataCall = CloudPricingDataService.getCloudPricingData(req);
        const itemInfoDataCall = ProductInfoService.getProductInfo(
            req.body.businessUnitNumber, req.body.product.supc,
        );

        return Promise.all([
            cloudPricingPCIDataCall,
            cloudPricingProductPricesDataCall,
            itemInfoDataCall,
        ])
            .then(([cloudPricingPCIResponse, cloudPricingProductPricesResponse, itemCallResponse]) => {
                let finalResponse = {};
                const productPricePayload = cloudPricingProductPricesResponse.data;
                const pciPricePayload = cloudPricingPCIResponse.data;
                const itemInfoPayload = itemCallResponse.data;
                // validating CP responses
                this.checkCPResponseErrorStatus(productPricePayload, pciPricePayload);

                // selecting tiers from product-prices and tag applicable tier
                const modifiedCloudPricingProductPricesResponse = this.getApplicableTier(requestBody, productPricePayload);
                const modifiedVolumeTiers = get(modifiedCloudPricingProductPricesResponse, 'products[0].volumePricingTiers', []);

                // selecting price source name
                const priceSourceName = this.getPriceSourceName(pciPricePayload);

                // filtering item info data
                const filteredItemPayload = this.filterItemInfoData(itemInfoPayload);

                // filtering root level attributes in pci-prices data
                const rootLevelData = this.filterRootLevelPCIPricePayloadData(pciPricePayload);

                // adding root level data to final response
                finalResponse = { ...rootLevelData };
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
