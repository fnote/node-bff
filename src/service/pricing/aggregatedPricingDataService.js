/**
 * Aggregated Pricing Data Service
 *
 * @author: adis0892 on 03/08/20
 * */

import CloudPricingDataService from './cloudPricingDataService';
import ProductInfoService from '../productInfo/productInfoService';
import { pricingDataReqBody } from '../../validator/schema';
import logger from '../../util/logger';
import InvalidRequestException from '../../exception/invalidRequestException';
import CloudPricingDataFetchException from '../../exception/cloudPricingDataFetchException';
import * as HttpStatus from 'http-status-codes';
import { ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY } from '../../util/constants';
import { getPriceSourceName } from '../../config/configs';
import {
    PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE, PCI_PRICE_DATA_FETCH_ERROR_CODE,
    PRODUCT_PRICE_DATA_FETCH_ERROR_CODE
} from '../../exception/exceptionCodes';

class AggregatedPricingDataService {

    /**
     * This function selects the relavant tier based on the
     * provided quantity
     * @param {*} requestBody
     * @param {*} pciPricesPayload
     */
    _getApplicableTier(requestBody, pciPricesPayload) {
        let qty = requestBody.requestedQuantity;
        let volumenTiersList = pciPricesPayload.products[0].volumePricingTiers;
        let modifiedVolumeTierList = []
        if (volumenTiersList && Object.keys(volumenTiersList).length !== 0) {
            volumenTiersList.forEach(tier => {
                let eligibility = tier.eligibility;
                if (eligibility.operator === "Between") {
                    if (eligibility.lowerBound <= qty && qty <= eligibility.upperBound) {
                        tier = { ...tier, "isApplicable": true }
                    } else {
                        tier = { ...tier, "isApplicable": false }
                    }
                } else if (eligibility.operator === ">=") {
                    if (eligibility.lowerBound <= qty) {
                        tier = { ...tier, "isApplicable": true }
                    } else {
                        tier = { ...tier, "isApplicable": false }
                    }
                }
                modifiedVolumeTierList.push(tier)
            });
            pciPricesPayload.products[0].volumePricingTiers = modifiedVolumeTierList
        }
        return pciPricesPayload;
    }

    _getPriceSourceName(pciPricesPayload) {
        return getPriceSourceName(pciPricesPayload.products[0].priceSource);
    }

    /**
     * This function process the status section of CP request when the status code is 200
     * for errornous scenatios
     * @param  {} productPricePayload
     * @param  {} pciPricePayload
     */
    _checkCPResponseErrorStatus(productPricePayload, pciPricePayload) {
        let productPayloadStatus = productPricePayload.products[0].statuses;
        let pciPayloadStatus = pciPricePayload.products[0].statuses;
        if (productPayloadStatus.length && productPayloadStatus[0].state == "CRITICAL") {
            const errorMessage = `Failed to fetch data from Cloud Pricing Endpoint, ${productPayloadStatus[0].message}`;
            logger.error(`${errorMessage}`);
            throw new CloudPricingDataFetchException(
                errorMessage,
                productPayloadStatus[0].message,
                PRODUCT_PRICE_DATA_FETCH_ERROR_CODE
            );
        } else if (pciPayloadStatus.length && productPayloadStatus[0].state == "CRITICAL") {
            const errorMessage = `Failed to fetch data from Cloud Pricing Endpoint, ${pciPayloadStatus[0].message}`;
            logger.error(`${errorMessage}`);
            throw new CloudPricingDataFetchException(
                errorMessage,
                pciPayloadStatus[0].message,
                PCI_PRICE_DATA_FETCH_ERROR_CODE
            );
        }
    }

    /**
     * This function filters required data from itemInfo response
     * @param  {} itemInfoPayload
     */
    _filterItemInfoData(itemInfoPayload){
        const { id, name, pack, size, brandId, brand, stockIndicator, averageWeight,
            catchWeightIndicator, split, shipSplitOnly } = itemInfoPayload;
        const filteredItemPayload = {}
        filteredItemPayload["id"] = id;
        filteredItemPayload["name"] = name;
        filteredItemPayload["pack"] = pack;
        filteredItemPayload["size"] = size;
        filteredItemPayload["brandId"] = brandId;
        filteredItemPayload["brand"] = brand;
        filteredItemPayload["stockIndicator"] = stockIndicator;
        filteredItemPayload["averageWeight"] = averageWeight;
        filteredItemPayload["catchWeightIndicator"] = catchWeightIndicator;
        filteredItemPayload["split"] = split;
        filteredItemPayload["shipSplitOnly"] = shipSplitOnly;
        return filteredItemPayload;
    }

    _filterRootLevelPCIPricePayloadData(pciPricePayload){
        const { businessUnitNumber, customerAccount, customerType, priceRequestDate, requestStatuses } = pciPricePayload;
        let rootLevelData = {};
        rootLevelData["businessUnitNumber"] = businessUnitNumber;
        rootLevelData["customerAccount"] = customerAccount;
        rootLevelData["customerType"] = customerType;
        rootLevelData["priceRequestDate"] = priceRequestDate;
        rootLevelData["requestStatuses"] = requestStatuses;
        return rootLevelData;
    }

    async getAggregatedPricingData(req) {

        const requestBody = req.body;
        const { error } = pricingDataReqBody.validate(requestBody);
        if (error) {
            logger.error(`Request body validation failed in getAggregatedPricingData: ${requestBody}`);
            throw new InvalidRequestException(
                ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
                PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE
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
                let productPricePayload = cloudPricingProductPricesResponse.data;
                let pciPricePayload = cloudPricingPCIResponse.data;
                let itemInfoPayload = itemCallResponse.data;

                // validating CP responses
                this._checkCPResponseErrorStatus(productPricePayload, pciPricePayload);

                // selecting tiers from product-prices and tag applicable tier
                const modifiedCloudPricingProductPricesResponse = this._getApplicableTier(requestBody, productPricePayload)

                //selecting price source name
                const priceSourceName = this._getPriceSourceName(pciPricePayload)

                // filtering item info data
                const filteredItemPayload = this._filterItemInfoData(itemInfoPayload)

                // filtering root level attributes in pci-prices data
                const rootLevelData = this._filterRootLevelPCIPricePayloadData(pciPricePayload)
                
                // adding root level data to final response
                finalResponse = { ...rootLevelData }
                // building product section
                finalResponse["product"] = {
                    ...filteredItemPayload, "priceSourceName": priceSourceName, ...pciPricePayload.products[0],
                    "volumePricingTiers": [...modifiedCloudPricingProductPricesResponse.products[0].volumePricingTiers]
                }
                return finalResponse;
            })
            .catch(err => {
                logger.error(`Error occurred in while processing pricing data in getAggregatedPricingData: ${err}`);
                throw err;
            });
    }
}

export default new AggregatedPricingDataService();
