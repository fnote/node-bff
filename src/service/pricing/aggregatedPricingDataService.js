/**
 * Aggregated Pricing Data Service
 *
 * @author: adis0892 on 03/08/20
 * */

import CloudPricingDataService from './cloudPricingDataService';
import ProductInfoService from '../productInfo/productInfoService';

class AggregatedPricingDataService {
    async getAggregatedPricingData(req) {
        // const cloudPricingCall = CloudPricingDataService.getCloudPricingData(req);

        // const itemInfoCall = ProductInfoService.getProductInfo(
        //     req.body.businessUnitNumber, req.body.products[0].supc,
        // );

        // return Promise.all([
        //     cloudPricingCall,
        //     itemInfoCall,
        // ])
        //     .then(([cloudPricingResponse, itemInfoResponse]) => ({
        //         cloudPricingResponse: {
        //             cloudPricingResponseStatus: cloudPricingResponse.status,
        //             cloudPricingResponseData: cloudPricingResponse.data,
        //         },
        //         itemInfoResponse: {
        //             itemInfoResponseStatus: itemInfoResponse.status,
        //             itemInfoResponseData: itemInfoResponse.data,
        //         },

        //     }));
        const customerNameMockResponse = {
            "customerName": "Mikes Seafood & Grill",
        }
        const itemInfoMockResponse = {
            "id": "3183792",
            "name": "BEEF PATTY W/ MUSHROOMS",
            "description": "Beef Patty with Mushrooms",
            "lineDescription": "Allergen FreeNo Caramel ColorR educed FatReduced Sodium.",
            "pack": "6",
            "size": "5LB",
            "brandId": "JTM",
            "brand": "JTM",
            "categoryId": 3,
            "catMajId": 2,
            "catIntId": 4,
            "catMinId": 3,
            "manufacturerCode": "CP5671",
            "imageLink": null,
            "categoryName": "MEATS",
            "catMajName": "BEEF FROZEN",
            "catIntName": "BEEF PRE-COOKED",
            "catMinName": "PATTIES",
            "taxonomy": {
                "hierarchyId": 1053,
                "businessCenter": "BEEF",
                "itemGroup": "GROUND/DICED",
                "attributeGroup": "BEEF PATTIES",
                "attributes": null
            },
            "hasCNLabel": false,
            "sizeUom": null,
            "dimension": {
                "uom": null,
                "length": 0,
                "width": 0,
                "height": 0
            },
            "netWeight": null,
            "grossWeight": null,
            "weightUom": null,
            "totalShelfLife": 0,
            "gtin": 10049485056710,
            "isSyscoBrand": false,
            "isCatchWeight": false,
            "fnbFlag": null,
            "consumerInformation": {
                "generalDescription": null,
                "prepAndCookingInstructions": null,
                "storageAndUsage": null
            },
            "opcoId": "058",
            "statusCode": "D",
            "stockIndicator": "N",
            "asoh": 0,
            "proprietaryCode": "L",
            "internalUpc": null,
            "externalUpc": 10049485056710,
            "averageWeight": 30,
            "storageCode": "F",
            "hseBrandFlag": "N",
            "phaseOtFlag": "N",
            "catchWeightIndicator": "N",
            "split": "N",
            "minimumSplit": 0,
            "shipSplitOnly": "N",
            "buyMultiple": 0,
            "unitPerCase": 6,
            "kosher": false,
            "vegan": false,
            "halal": false,
            "vegetarian": false,
            "organic": false,
            "greenCertified": false,
            "coreIndicator": " ",
            "relatedProductId": null,
            "lastOrderedDate": null,
            "controlCode": "CS",
            "leadTimeForecast": 21,
            "isDropShip": false,
            "grdCode": " ",
            "isSelectedNonstock": false,
            "quantity": null,
            "brokerId": "",
            "brokerName": "Acosta",
            "sourceVendor": null,
            "sourceVendorType": null,
            "trueVendor": null,
            "trueVendorShipPtNumber": "0",
            "productSpecialist": null,
            "productSpecialistName": null,
            "isSlowMoving": false,
            "demandStatusFlag": 0,
            "last30quantity": 0,
            "rdcNumber": null,
            "productionItemFlag": null,
            "trueVendorName": null,
            "governmentGrade": null,
            "subPrimalCode": null,
            "subPrimalDescription": null,
            "masterCase": 0,
            "itemCube": null,
            "usablePortion": null,
            "sourceVendorShipPointNumber": null,
            "brokerNumber": "729753",
            "brokerContactName": "Michael Wilner",
            "brokerContactPhone": "5864820233",
            "brokerContactEmail": "mwilner@acosta.com",
            "productSpecialistPhone": null,
            "localDescription": null,
            "active": false,
            "category": "03002004003",
            "isProprietary": true,
            "isNonstock": true,
            "isNonstockOrderable": false,
            "isLeavingSoon": false,
        }

        const cloudPricingMockResponse = {
            "businessUnitNumber": "001",
            "customerAccount": "571549",
            "customerType": "TRS",
            "priceZone": "05",
            "priceRequestDate": "20200724",
            "requestStatuses": [],
            "products": [
                {
                    "supc": "3183792",
                    "splitFlag": false,
                    "shipSplitsOnlyFlag": false,
                    "unitsPerCase": 1,
                    "perWeightFlag": false,
                    "averageNetWeight": 10.2500,
                    "grossPrice": 84.21,
                    "customerReferencePrice": 76.21,
                    "customerPrequalifiedPrice": 76.21,
                    "unitPrice": 73.80,
                    "netPrice": 73.80,
                    "agreementIndicators": ["C"],
                    "priceSource": 97,
                    "minPrice": 67.53,
                    "minHandlingFlag": "N",
                    "grossCommissionBasis": 71.15,
                    "handPricingAllowedFlag": false,
                    "statuses": [
                        {
                            "code": 200,
                            "state": "INFO",
                            "message": "status message"
                        }
                    ],
                    "priceRule": {
                        "name": "&5STAR",
                        "baseValue": 64.2500,
                        "factorCalcMethod": "MGN",
                        "factorSign": "+",
                        "factorValue": 9.2500
                    },
                    "agreements": [
                        {
                            "id": "832120",
                            "type": "C",
                            "applicationCode": "P",
                            "description": "Dollars Off -1",
                            "priceAdjustment": -1.28,
                            "percentageAdjustment": 1.5,
                            "methodCode": "APPLY TO PRICE",
                            "effectiveFrom": "20191103",
                            "effectiveTo": "20291103"
                        },
                        {
                            "id": "832128",
                            "type": "C",
                            "applicationCode": "P",
                            "description": "Dollars Off",
                            "priceAdjustment": -1.28,
                            "percentageAdjustment": 0,
                            "methodCode": "APPLY TO PRICE",
                            "effectiveFrom": "20191103",
                            "effectiveTo": "20291103"
                        },
                        {
                            "id": "832128",
                            "type": "CHEF",
                            "applicationCode": "P",
                            "description": "Percent Off",
                            "priceAdjustment": -2.41,
                            "percentageAdjustment": 0,
                            "methodCode": "APPLY TO PRICE",
                            "effectiveFrom": "20191103",
                            "effectiveTo": "20291103"
                        },
                        {
                            "id": "832129",
                            "type": "CHEF",
                            "applicationCode": "B",
                            "description": "Percent Off",
                            "priceAdjustment": -2.41,
                            "percentageAdjustment": 0,
                            "methodCode": "APPLY TO BASE",
                            "effectiveFrom": "20191103",
                            "effectiveTo": "20291103"
                        },
                        {
                            "id": "832130",
                            "type": "CHEF",
                            "applicationCode": "L",
                            "description": "OFFL",
                            "priceAdjustment": -2.41,
                            "percentageAdjustment": 0,
                            "methodCode": "OFFLINE",
                            "effectiveFrom": "20191103",
                            "effectiveTo": "20291103"
                        },
                        {
                            "id": "832130",
                            "type": "CHEF",
                            "applicationCode": "T",
                            "description": "OFFT",
                            "priceAdjustment": -2.41,
                            "percentageAdjustment": 0,
                            "methodCode": "OFFLINE",
                            "effectiveFrom": "20191103",
                            "effectiveTo": "20291103"
                        }
                    ],
                    "exception": {
                        "id": "1234",
                        "price": 71.15,
                        "effectiveFrom": "20200523",
                        "effectiveTo": "20210530"
                    },
                    "discounts": [
                        {
                            "id": "243512",
                            "type": "REFERENCE_PRICE",
                            "name": "STRATEGIC_DISCOUNT",
                            "priceAdjustment": -8.00,
                            "amountType": "Factor",
                            "amount": 0.90,
                            "effectiveFrom": "20191103",
                            "effectiveTo": "20291103"
                        }
                    ],
                    "volumePricingTiers": [
                        {
                            "customerPrequalifiedPrice": 45.49,
                            "unitPrice": 45.49,
                            "netPrice": 45.49,
                            "eligibility": {
                                "operator": "Between",
                                "lowerBound": 10,
                                "upperBound": 20
                            },
                            "agreements": [],
                            "discounts": [
                                {
                                    "id": "901",
                                    "type": "PREQUALIFIED",
                                    "name": "CASE_VOLUME_DISCOUNT",
                                    "amountType": "Factor",
                                    "amount": 0.9,
                                    "priceAdjustment": -5.06,
                                    "effectiveFrom": "20200808",
                                    "effectiveTo": "20220731"
                                }
                            ]
                        },
                        {
                            "customerPrequalifiedPrice": 40.44,
                            "unitPrice": 40.44,
                            "netPrice": 40.44,
                            "eligibility": {
                                "operator": "Between",
                                "lowerBound": 21,
                                "upperBound": 30
                            },
                            "agreements": [],
                            "discounts": [
                                {
                                    "id": "901",
                                    "type": "PREQUALIFIED",
                                    "name": "CASE_VOLUME_DISCOUNT",
                                    "amountType": "Factor",
                                    "amount": 0.8,
                                    "priceAdjustment": -10.11,
                                    "effectiveFrom": "20200808",
                                    "effectiveTo": "20220731"
                                }
                            ]
                        },
                        {
                            "customerPrequalifiedPrice": 35.38,
                            "unitPrice": 35.38,
                            "netPrice": 35.38,
                            "eligibility": {
                                "operator": ">=",
                                "lowerBound": 31
                            },
                            "agreements": [],
                            "discounts": [
                                {
                                    "id": "901",
                                    "type": "PREQUALIFIED",
                                    "name": "CASE_VOLUME_DISCOUNT",
                                    "amountType": "Factor",
                                    "amount": 0.7,
                                    "priceAdjustment": -15.17,
                                    "effectiveFrom": "20200808",
                                    "effectiveTo": "20220731"
                                }
                            ]
                        }
                    ],
                    "rounding": {
                        "calculatedAmount": 0.0005
                    }
                }
            ]
        }
        cloudPricingMockResponse.products =  {...itemInfoMockResponse, ...cloudPricingMockResponse.products[0]}
        return {
            ... customerNameMockResponse,
            ... cloudPricingMockResponse
        }
    }
}

export default new AggregatedPricingDataService();
