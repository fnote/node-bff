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
import * as HttpStatus from 'http-status-codes';
import { ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY } from '../../util/constants';
import { getPriceSourceName } from '../../config/configs';

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

    async getAggregatedPricingData(req) {

        const requestBody = req.body;
        const { error } = pricingDataReqBody.validate(requestBody);
        if (error) {
            logger.error(`Request body validation failed in getAggregatedPricingData: ${requestBody}`);
            throw new InvalidRequestException(
                ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            );
        }

        const cloudPricingPCIDataCall = CloudPricingDataService.getCloudPricingPCIData(req);
        const cloudPricingProductPricesDataCall = CloudPricingDataService.getCloudPricingData(req);
        const itemInfoDataCall = ProductInfoService.getProductInfo(
            req.body.businessUnitNumber, req.body.product.supc,
        );

        // TODO @sanjayaa catch below
        return Promise.all([
            cloudPricingPCIDataCall,
            cloudPricingProductPricesDataCall,
            itemInfoDataCall,
        ])
            .then(([cloudPricingPCIResponse, cloudPricingProductPricesResponse, itemCallResponse]) => {

                let finalResponse = {};

                // select tiers from product-prices and selection applicable tier
                const modifiedCloudPricingProductPricesResponse = this._getApplicableTier(requestBody, cloudPricingProductPricesResponse.data)
                //select price source name
                const priceSourceName = this._getPriceSourceName(cloudPricingPCIResponse.data)

                // filtering item info data
                const { id, name, pack, size, brandId, brand, stockIndicator, averageWeight, catchWeightIndicator, split, shipSplitOnly } = itemCallResponse.data;
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

                // filtering root level attributes in pci-prices data
                const { businessUnitNumber, customerAccount, customerType, priceRequestDate, requestStatuses } = cloudPricingPCIResponse.data;
                finalResponse["businessUnitNumber"] = businessUnitNumber;
                finalResponse["customerAccount"] = customerAccount;
                finalResponse["customerType"] = customerType;
                finalResponse["priceRequestDate"] = priceRequestDate;
                finalResponse["requestStatuses"] = requestStatuses;

                // building product section
                finalResponse["product"] = { ...filteredItemPayload, "priceSourceName": priceSourceName, ...cloudPricingPCIResponse.data.products[0], "volumePricingTiers": [...modifiedCloudPricingProductPricesResponse.products[0].volumePricingTiers] }
                return finalResponse;
            });
    }
}

export default new AggregatedPricingDataService();
