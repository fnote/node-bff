import * as HTTP from 'http-status-codes';

export const cloudPricingMockResponse = {
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

export const pricingDataMockRequest = {
    businessUnitNumber: '067',
    customerAccount: '758028',
    priceRequestDate: '20200605',
    products: [
        {
            supc: '7203474', splitFlag: false, quantity: 1,
        },
    ],
};

export const PricingDataMockResponse = {
    cloudPricingResponse: {
        cloudPricingResponseStatus: 200,
        cloudPricingResponseData: {
            businessUnitNumber: '067',
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
        itemInfoResponseStatus: 200,
        itemName: 'abc',
    },
};

export const cloudPricingMockResponseForAggregatedPricingCall = {
    status: HTTP.OK,
    data: {
        businessUnitNumber: '067',
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
        itemInfoResponseStatus: 200,
        itemName: 'abc',
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
    cause: 'Failed to fetch data from Cloud Pricing Endpoint',
};
