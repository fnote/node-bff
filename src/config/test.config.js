import * as HTTP from 'http-status-codes';

export const productInfoMockResponse = {
    status: HTTP.OK,
    data: {
        id: '7203474',
        name: 'BEEF RIBEYE LIPON CH 112A',
        description: 'Beef Ribeye Lip-On Choice NAMP 112A',
        lineDescription: 'THIS IBP CHOICE RIBEYE IS BONELESS AND PRACTICALLY FREE OF SURFACE FAT AND INTERCOSTAL MEAT. THE LIP-ON LEAVES A LIP(MAXIMUM WIDTH OF TWO INCHES) OF MUSCLES AND RELATED FAT ATTACHED TO THE OUTER TIP OF THE RIBEYE MUSCLE.APPLICATIONS ARE BONELESS RIB ROASTS, HIGH QUALITY ROAST BEEF,GRILLED OR BROILED RIBEYE STEAK FOR LOTS OF PLATE COVERAGE. THIS PRODUCT IS CHOICE.',
        pack: '5',
        size: 'HEAVY',
        brandId: 'IBP',
        brand: 'IOWA BEEF PROCESSORS',
        stockIndicator: "N",
        averageWeight: 30,
        catchWeightIndicator: "N",
        split: "N",
        shipSplitOnly: "N",
    },
};

export const productInfoErrorMockResponse = {
    errorCode: '1002',
    incidentId: '2a52a105-10ef-4c61-891d-ea3cf987de4c',
    errors: [
        'OPCOPRODUCT can not be found!',
    ],
};

export const cloudPricingMockResponse = {
    businessUnitNumber: '068',
    customerAccount: '758026',
    priceRequestDate: '20200605',
    requestStatuses: [],
    products: [
        {
            "supc": "7203474",
            "splitFlag": true,
            "shipSplitsOnlyFlag": true,
            "unitsPerCase": 12,
            "perWeightFlag": false,
            "averageNetWeight": 23.5000,
            "grossPrice": 2.61,
            "customerReferencePrice": 2.61,
            "customerPrequalifiedPrice": 2.61,
            "unitPrice": 23.18,
            "netPrice": 23.22,
            "agreementIndicators": [],
            "priceSource": 96,
            "minPrice": 0,
            "minHandlingFlag": "",
            "grossCommissionBasis": 2.55,
            "handPricingAllowedFlag": false,
            "statuses": [],
            "priceRule": {
                "name": "NEWTRS",
                "baseValue": 2.55,
                "factorCalcMethod": "MGN",
                "factorSign": "+",
                "factorValue": 2.0000
            },
            "agreements": [
                {
                    "id": "195950",
                    "type": "BDEP",
                    "applicationCode": "L",
                    "description": "PRICING BOTTLE DEPOSIT TEST",
                    "priceAdjustment": 0.04,
                    "priceAdjustmentCode": "C",
                    "rebateBasis": "DC",
                    "methodCode": "OFF INVOICE LINE",
                    "effectiveFrom": "20200915",
                    "effectiveTo": "20201231"
                }
            ],
            "exception": {
                "id": "100",
                "price": 23.180,
                "effectiveFrom": "20200818",
                "effectiveTo": "20201030"
            },
            "discounts": [],
            "volumePricingTiers": []
        },
    ]
};

export const cloudPCIPricingMockResponse = {
    "businessUnitNumber": "068",
    "customerAccount": "758026",
    "customerType": "TRS",
    "priceRequestDate": "20201026",
    "requestStatuses": [],
    "products": [
        {
            "supc": "7203474",
            "splitFlag": true,
            "shipSplitsOnlyFlag": true,
            "priceZoneId": 0,
            "quantity": 12,
            "unitsPerCase": 12,
            "perWeightFlag": false,
            "averageNetWeight": 23.5000,
            "grossPrice": 2.61,
            "referencePriceRoundingAdjustment": 0,
            "customerReferencePrice": 2.61,
            "customerPrequalifiedPrice": 2.61,
            "unitPrice": 23.18,
            "netPrice": 23.22,
            "agreementIndicators": [],
            "priceSource": 96,
            "minPrice": 0,
            "minHandlingFlag": "",
            "grossCommissionBasis": 2.55,
            "handPricingAllowedFlag": false,
            "originalSupc": null,
            "subReasonCode": null,
            "orderPrice": null,
            "orderPriceType": null,
            "statuses": [],
            "priceRule": {
                "name": "NEWTRS",
                "baseValue": 2.55,
                "factorCalcMethod": "MGN",
                "factorSign": "+",
                "factorValue": 2.0000
            },
            "agreements": [
                {
                    "id": "195950",
                    "type": "BDEP",
                    "applicationCode": "L",
                    "description": "PRICING BOTTLE DEPOSIT TEST",
                    "priceAdjustment": 0.04,
                    "priceAdjustmentCode": "C",
                    "rebateBasis": "DC",
                    "methodCode": "OFF INVOICE LINE",
                    "effectiveFrom": "20200915",
                    "effectiveTo": "20201231"
                }
            ],
            "exception": {
                "id": "100",
                "price": 23.180,
                "effectiveFrom": "20200818",
                "effectiveTo": "20201030"
            },
            "discounts": []
        }
    ]
}

export const aggregatedPricingMockResponst = {
    businessUnitNumber: '068',
    customerAccount: '758026',
    customerType: 'TRS',
    priceRequestDate: '20201026',
    requestStatuses: [],
    product: {
        id: '7203474',
        name: 'BEEF RIBEYE LIPON CH 112A',
        pack: '5',
        size: 'HEAVY',
        brandId: 'IBP',
        brand: 'IOWA BEEF PROCESSORS',
        stockIndicator: 'N',
        averageWeight: 30,
        catchWeightIndicator: 'N',
        split: 'N',
        shipSplitOnly: 'N',
        priceSourceName: 'Exception',
        supc: '7203474',
        splitFlag: true,
        shipSplitsOnlyFlag: true,
        priceZoneId: 0,
        quantity: 12,
        unitsPerCase: 12,
        perWeightFlag: false,
        averageNetWeight: 23.5,
        grossPrice: 2.61,
        referencePriceRoundingAdjustment: 0,
        customerReferencePrice: 2.61,
        customerPrequalifiedPrice: 2.61,
        unitPrice: 23.18,
        netPrice: 23.22,
        agreementIndicators: [],
        priceSource: 96,
        minPrice: 0,
        minHandlingFlag: '',
        grossCommissionBasis: 2.55,
        handPricingAllowedFlag: false,
        originalSupc: null,
        subReasonCode: null,
        orderPrice: null,
        orderPriceType: null,
        statuses: [],
        priceRule: {
            name: 'NEWTRS',
            baseValue: 2.55,
            factorCalcMethod: 'MGN',
            factorSign: '+',
            factorValue: 2
        },
        agreements: [
            {
                "id": "195950",
                "type": "BDEP",
                "applicationCode": "L",
                "description": "PRICING BOTTLE DEPOSIT TEST",
                "priceAdjustment": 0.04,
                "priceAdjustmentCode": "C",
                "rebateBasis": "DC",
                "methodCode": "OFF INVOICE LINE",
                "effectiveFrom": "20200915",
                "effectiveTo": "20201231"
            }
        ],
        exception: {
            id: '100',
            price: 23.18,
            effectiveFrom: '20200818',
            effectiveTo: '20201030'
        },
        discounts: [],
        volumePricingTiers: []
    }
};

export const cloudPricingMockRequest = {
    body: {
        businessUnitNumber: '068',
        customerAccount: '758028',
        priceRequestDate: '20200605',
        products: [
            {
                supc: '7203474', splitFlag: false,
            },
        ],
    },
};

export const cloudPricingPCIMockRequest = {
    body: {
        businessUnitNumber: "068",
        customerAccount: "758028",
        priceRequestDate: "20200605",
        products:
            [
                { supc: "7203474", splitFlag: false, quantity: "3" }
            ]
    }
};

export const cloudPricingErrorMockRequest = {
    body: {
        businessUnitNumber: "069",
        customerAccount: "758028",
        priceRequestDate: "20200605",
        requestedQuantity: 3,
        product: {
            supc: "7203474",
            splitFlag: false
        }
    }
};

export const cloudPricingMockRequestForErrorScenario = {
    body: {
        businessUnitNumber: '058',
        customerAccount: '758028',
        priceRequestDate: '20200605',
        products: [
            {
                supc: '7203474', splitFlag: false,
            },
        ],
    },
};

export const cloudPricingDataMockRequest = {
    businessUnitNumber: '068',
    customerAccount: '758028',
    priceRequestDate: '20200605',
    products: [
        {
            supc: '7203474', splitFlag: false, quantity: 1,
        },
    ],
};

export const pricingDataMockRequest = {
    body: {
        businessUnitNumber: '068',
        customerAccount: '758028',
        priceRequestDate: '20200605',
        requestedQuantity: 3,
        product: {
            supc: "7203474",
            splitFlag: false
        }
    }
};

export const PricingDataMockResponse = {
    cloudPricingResponse: {
        cloudPricingResponseStatus: 200,
        cloudPricingResponseData: {
            businessUnitNumber: '068',
            customerAccount: '758026',
            priceRequestDate: '20200605',
            requestStatuses: [],
            products: [
                {
                    supc: '7203474',
                    splitIndicator: ' ',
                    unitsPerCase: 4,
                    perWeightFlag: false,
                    averageNetWeight: 40.0000,
                    suggestedPrice: 75.75,
                    grossPrice: 78.09,
                    unitPrice: 75.75,
                    netPrice: 75.75,
                },
            ],
        },
    },
    itemInfoResponse: {
        itemInfoResponseStatus: productInfoMockResponse.status,
        itemInfoResponseData: productInfoMockResponse.data,
    },
};

export const cloudPricingMockResponseForAggregatedPricingCall = {
    status: HTTP.OK,
    data: {
        businessUnitNumber: '068',
        customerAccount: '758026',
        priceRequestDate: '20200605',
        requestStatuses: [],
        products: [
            {
                supc: '7203474',
                splitIndicator: ' ',
                unitsPerCase: 4,
                perWeightFlag: false,
                averageNetWeight: 40.0000,
                suggestedPrice: 75.75,
                grossPrice: 78.09,
                unitPrice: 75.75,
                netPrice: 75.75,
            },
        ],
    },
};

export const pricingDataMockRequestForErrorOnCloudPricingCall = {
    businessUnitNumber: '067-error',
    customerAccount: '758028',
    priceRequestDate: '20200605',
    products: [
        {
            supc: '7203474', splitFlag: false, quantity: 1,
        },
    ],
};

export const cloudPricingMockResponseForAggregatedErrorPricingCall = {
    status: HTTP.BAD_GATEWAY,
    data: {
        businessUnitNumber: '067-error',
        customerAccount: '758026',
        priceRequestDate: '20200605',
        requestStatuses: [],
        products: [
            {
                supc: '7203474',
                splitIndicator: ' ',
                unitsPerCase: 4,
                perWeightFlag: false,
                averageNetWeight: 40.0000,
                suggestedPrice: 75.75,
                grossPrice: 78.09,
                unitPrice: 75.75,
                netPrice: 75.75,
            },
        ],
    },
};

export const PricingDataMockResponseForErrorOnCloudPricingCall = {
    cloudPricingResponse: {
        cloudPricingResponseStatus: HTTP.BAD_GATEWAY,
        cloudPricingResponseData: {
            businessUnitNumber: '067-error',
            customerAccount: '758026',
            priceRequestDate: '20200605',
            requestStatuses: [],
            products: [
                {
                    supc: '7203474',
                    splitIndicator: ' ',
                    unitsPerCase: 4,
                    perWeightFlag: false,
                    averageNetWeight: 40.0000,
                    suggestedPrice: 75.75,
                    grossPrice: 78.09,
                    unitPrice: 75.75,
                    netPrice: 75.75,
                },
            ],
        },
    },
    itemInfoResponse: {
        itemInfoResponseStatus: productInfoMockResponse.status,
        itemInfoResponseData: productInfoMockResponse.data,
    },
};

export const pricingDataMockRequestThrowErrorForCloudPricingCall = {
    businessUnitNumber: '067-exception-thrown',
    customerAccount: '758028',
    priceRequestDate: '20200605',
    products: [
        {
            supc: '7203474', splitFlag: false, quantity: 1,
        },
    ],
};

export const pricingDataMockResponseThrowErrorForCloudPricingCall = {
    status: 'error',
    message: 'Error occurred in getting pricing related data',
    cause: {},
    errorCode: 4000
};
