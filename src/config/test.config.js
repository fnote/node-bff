import * as HTTP from 'http-status-codes';

export const productInfoMockResponse = {
    status: HTTP.OK,
    data: {
        id: '7203474',
        name: 'BEEF RIBEYE LIPON CH 112A',
        description: 'Beef Ribeye Lip-On Choice NAMP 112A',
        // eslint-disable-next-line max-len
        lineDescription: 'THIS IBP CHOICE RIBEYE IS BONELESS AND PRACTICALLY FREE OF SURFACE FAT AND INTERCOSTAL MEAT. THE LIP-ON LEAVES A LIP(MAXIMUM WIDTH OF TWO INCHES) OF MUSCLES AND RELATED FAT ATTACHED TO THE OUTER TIP OF THE RIBEYE MUSCLE.APPLICATIONS ARE BONELESS RIB ROASTS, HIGH QUALITY ROAST BEEF,GRILLED OR BROILED RIBEYE STEAK FOR LOTS OF PLATE COVERAGE. THIS PRODUCT IS CHOICE.',
        pack: '5',
        size: 'HEAVY',
        brandId: 'IBP',
        brand: 'IOWA BEEF PROCESSORS',
        stockIndicator: 'N',
        averageWeight: 30,
        catchWeightIndicator: 'N',
        split: 'N',
        shipSplitOnly: 'N',
    },
};

export const customerInfoMockResponse = {
    status: HTTP.OK,
    data: {
        opcoId: '019',
        customerId: '622548',
        name: 'KENNEDY AVE FOOD MART SACA',
        city: 'CINCINNATI',
        state: 'OH',
        country: 'USA',
        accountType: 'TRS',
        cuisineType: 'DEL',
        priceLevel: 1,
        overrideChartId: 'OVRKRISPY',
        overrideChartOrigin: 'L',
        restrictionChartId: 'RESCOVID',
        restrictionChartOrigin: 'L',
        modifiedBy: 'Mimix:C019IRDD',
        stopCode: '',
        departmentCode: '0',
        addressLine1: '5361 KENNEDY AVE',
        addressLine2: '',
        addressLine3: '',
        zipCode: '45213-2621',
        telNumber: '5133512014',
        contactFaxNumber: '5133512012',
        customerContactName: 'JAY PATEL  AP',
        corporateTypeOfOperationCode: '031',
        localTypeOfOperationCode: '031',
        designatedDeliveryDay: '  0    ',
        priceRuleName: 'NEWTRS',
        transCd: '',
        cutoffTime: '140000',
        entryDescription: 'JACKSON CHRISTINA',
        slspnCd: 'SAC10',
        shipToCustomerStatus: 'AC',
        lptpExcepLevel: 'A',
        totalBalance: 0,
        unappliedCash: 0,
        financialTerms: 'CN03',
        minRuleName: '',
        maxRuleName: '',
        defaultSubstituteTypeFlag: 'Y',
        shipIfAvailFlag: 'Y',
        partFillFlag: 'Y',
        esyscoCustomerFlag: 'Y',
        customerType: 'T',
        storeNumber: '',
        routingGroup: {
            monday: '06',
            tuesday: '06',
            wednesday: '06',
            thursday: '06',
            friday: '06',
            saturday: '06',
            sunday: '06',
        },
        nationalAccount: {
            nationalAccount: 'KRKR',
            nationalAccountName: 'KRISPY KRUNCHY',
            conceptId: 'KRKRKRKR',
            managedTypeId: 'L',
            nationalBeginDate: '2015-03-11',
            nationalEndDate: '9999-12-31',
        },
        billingAddress: {
            street: '5361 KENNEDY AVE',
            city: 'CINCINNATI',
            state: 'OH ',
            country: 'USA',
            zipCode: '45213-2621',
        },
        salesAssociateId: null,
        location: {
            longitude: null,
            latitude: null,
        },
        primaryCustomerId: '622548',
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
            supc: '7203474',
            splitFlag: true,
            shipSplitsOnlyFlag: true,
            unitsPerCase: 12,
            perWeightFlag: false,
            averageNetWeight: 23.5000,
            grossPrice: 2.61,
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
            statuses: [],
            priceRule: {
                name: 'NEWTRS',
                baseValue: 2.55,
                factorCalcMethod: 'MGN',
                factorSign: '+',
                factorValue: 2.0000,
            },
            agreements: [
                {
                    id: '195950',
                    type: 'BDEP',
                    applicationCode: 'L',
                    description: 'PRICING BOTTLE DEPOSIT TEST',
                    priceAdjustment: 0.04,
                    priceAdjustmentCode: 'C',
                    rebateBasis: 'DC',
                    methodCode: 'OFF INVOICE LINE',
                    effectiveFrom: '20200915',
                    effectiveTo: '20201231',
                },
            ],
            exception: {
                id: '100',
                price: 23.180,
                effectiveFrom: '20200818',
                effectiveTo: '20201030',
            },
            discounts: [],
            volumePricingTiers: [],
        },
    ],
};

export const cloudPCIPricingMockResponse = {
    businessUnitNumber: '068',
    customerAccount: '758026',
    customerType: 'TRS',
    priceRequestDate: '20201026',
    requestStatuses: [],
    products: [
        {
            supc: '7203474',
            splitFlag: true,
            shipSplitsOnlyFlag: true,
            priceZoneId: 0,
            quantity: 12,
            unitsPerCase: 12,
            perWeightFlag: false,
            averageNetWeight: 23.5000,
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
                factorValue: 2.0000,
            },
            agreements: [
                {
                    id: '195950',
                    type: 'BDEP',
                    applicationCode: 'L',
                    description: 'PRICING BOTTLE DEPOSIT TEST',
                    priceAdjustment: 0.04,
                    priceAdjustmentCode: 'C',
                    rebateBasis: 'DC',
                    methodCode: 'OFF INVOICE LINE',
                    effectiveFrom: '20200915',
                    effectiveTo: '20201231',
                },
            ],
            exception: {
                id: '100',
                price: 23.180,
                effectiveFrom: '20200818',
                effectiveTo: '20201030',
            },
            discounts: [],
        },
    ],
};

export const aggregatedPricingMockResponst = {
    businessUnitNumber: '068',
    customerAccount: '758026',
    customerType: 'TRS',
    customerName: 'KENNEDY AVE FOOD MART SACA',
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
            factorValue: 2,
        },
        agreements: [
            {
                id: '195950',
                type: 'BDEP',
                applicationCode: 'L',
                description: 'PRICING BOTTLE DEPOSIT TEST',
                priceAdjustment: 0.04,
                priceAdjustmentCode: 'C',
                rebateBasis: 'DC',
                methodCode: 'OFF INVOICE LINE',
                effectiveFrom: '20200915',
                effectiveTo: '20201231',
            },
        ],
        exception: {
            id: '100',
            price: 23.18,
            effectiveFrom: '20200818',
            effectiveTo: '20201030',
        },
        discounts: [],
        volumePricingTiers: [],
    },
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
        businessUnitNumber: '068',
        customerAccount: '758028',
        priceRequestDate: '20200605',
        products:
            [
                { supc: '7203474', splitFlag: false, quantity: '3' },
            ],
    },
};

export const cloudPricingErrorMockRequest = {
    body: {
        businessUnitNumber: '069',
        customerAccount: '758028',
        priceRequestDate: '20200605',
        requestedQuantity: 3,
        product: {
            supc: '7203474',
            splitFlag: false,
        },
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

export const cloudPricingMockRequestForErrorScenario2 = {
    body: {
        businessUnitNumber: '058',
        customerAccount: '758028',
        priceRequestDate: '20200605',
        product: {
            supc: '7203474', splitFlag: false,
        },

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
            supc: '7203474',
            splitFlag: false,
        },
    },
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
    errorCode: 4000,
};

export const pricingDataMockRequest1 = {
    businessUnitNumber: '019',
    customerAccount: '622548',
    priceRequestDate: '20201020',
    requestedQuantity: 3,
    product: {
        supc: '3183792',
        splitFlag: false,
    },
};

export const pricingDataMockErrorRequest = {
    businessUnitNumber: '019',
    customerAccount: '622548',
    priceRequestDate: '20201020',
    requestedQuantity: 'Blah',
    product: {
        supc: '3183792',
        splitFlag: false,
    },
};

export const pciPriceMockPayload = {
    businessUnitNumber: '019',
    customerAccount: '622548',
    priceRequestDate: '20201020',
    requestStatuses: [

    ],
    products: [
        {
            statuses: [],
            volumePricingTiers: [
                {
                    customerPrequalifiedPrice: 22.24,
                    unitPrice: 22.24,
                    netPrice: 22.24,
                    eligibility: {
                        operator: 'Between',
                        lowerBound: 2,
                        upperBound: 5,
                    },
                    agreements: [

                    ],
                    discounts: [
                        {
                            id: '6463',
                            type: 'PREQUALIFIED',
                            name: 'CASE_VOLUME_DISCOUNT',
                            amountType: 'Factor',
                            amount: 0.99,
                            priceAdjustment: -0.25,
                            effectiveFrom: '19000101',
                            effectiveTo: '21000101',
                        },
                    ],
                },
                {
                    customerPrequalifiedPrice: 22.24,
                    unitPrice: 22.24,
                    netPrice: 22.24,
                    eligibility: {
                        operator: 'Between',
                        lowerBound: 6,
                        upperBound: 8,
                    },
                    agreements: [

                    ],
                    discounts: [
                        {
                            id: '6463',
                            type: 'PREQUALIFIED',
                            name: 'CASE_VOLUME_DISCOUNT',
                            amountType: 'Factor',
                            amount: 0.99,
                            priceAdjustment: -0.25,
                            effectiveFrom: '19000101',
                            effectiveTo: '21000101',
                        },
                    ],
                },
                {
                    customerPrequalifiedPrice: 21.99,
                    unitPrice: 21.99,
                    netPrice: 21.99,
                    eligibility: {
                        operator: '>=',
                        lowerBound: 9,
                    },
                    agreements: [

                    ],
                    discounts: [
                        {
                            id: '6463',
                            type: 'PREQUALIFIED',
                            name: 'CASE_VOLUME_DISCOUNT',
                            amountType: 'Factor',
                            amount: 0.98,
                            priceAdjustment: -0.5,
                            effectiveFrom: '19000101',
                            effectiveTo: '21000101',
                        },
                    ],
                },
            ],
        },
    ],
};

export const pciPriceMockPayloadNoVolTiers = {
    businessUnitNumber: '019',
    customerAccount: '622548',
    priceRequestDate: '20201020',
    requestStatuses: [

    ],
    products: [
        {
            supc: '3183792',
            splitFlag: false,
            shipSplitsOnlyFlag: false,
            unitsPerCase: 6,
            perWeightFlag: false,
            averageNetWeight: 30,
            grossPrice: 26.3,
            customerReferencePrice: 24.99,
            customerPrequalifiedPrice: 22.49,
            unitPrice: 22.49,
            netPrice: 22.49,
            agreementIndicators: [

            ],
            priceSource: 97,
            minPrice: 0,
            minHandlingFlag: '',
            grossCommissionBasis: 45.05,
            handPricingAllowedFlag: false,
            statuses: [

            ],
            priceRule: null,
            agreements: [

            ],
            exception: null,
            discounts: [
                {
                    id: '50000',
                    type: 'REFERENCE_PRICE',
                    name: 'STRATEGIC_DISCOUNT',
                    amountType: 'Factor',
                    amount: 0.95,
                    priceAdjustment: -1.32,
                    effectiveFrom: '19000101',
                    effectiveTo: '21000101',
                },
                {
                    id: '107',
                    type: 'PREQUALIFIED',
                    name: 'NEW_CUSTOMER_DISCOUNT',
                    amountType: 'Factor',
                    amount: 0.9,
                    priceAdjustment: -2.5,
                    effectiveFrom: '19000101',
                    effectiveTo: '21000101',
                },
            ],
        },
    ],
};

export const pciModifiedPriceMockPayload1 = {
    businessUnitNumber: '019',
    customerAccount: '622548',
    priceRequestDate: '20201020',
    requestStatuses: [

    ],
    products: [
        {
            statuses: [],
            volumePricingTiers: [
                {
                    customerPrequalifiedPrice: 22.24,
                    unitPrice: 22.24,
                    netPrice: 22.24,
                    eligibility: {
                        operator: 'Between',
                        lowerBound: 2,
                        upperBound: 5,
                    },
                    agreements: [

                    ],
                    discounts: [
                        {
                            id: '6463',
                            type: 'PREQUALIFIED',
                            name: 'CASE_VOLUME_DISCOUNT',
                            amountType: 'Factor',
                            amount: 0.99,
                            priceAdjustment: -0.25,
                            effectiveFrom: '19000101',
                            effectiveTo: '21000101',
                        },
                    ],
                    isApplicable: true,
                },
                {
                    customerPrequalifiedPrice: 22.24,
                    unitPrice: 22.24,
                    netPrice: 22.24,
                    eligibility: {
                        operator: 'Between',
                        lowerBound: 6,
                        upperBound: 8,
                    },
                    agreements: [

                    ],
                    discounts: [
                        {
                            id: '6463',
                            type: 'PREQUALIFIED',
                            name: 'CASE_VOLUME_DISCOUNT',
                            amountType: 'Factor',
                            amount: 0.99,
                            priceAdjustment: -0.25,
                            effectiveFrom: '19000101',
                            effectiveTo: '21000101',
                        },
                    ],
                    isApplicable: false,
                },
                {
                    customerPrequalifiedPrice: 21.99,
                    unitPrice: 21.99,
                    netPrice: 21.99,
                    eligibility: {
                        operator: '>=',
                        lowerBound: 9,
                    },
                    agreements: [

                    ],
                    discounts: [
                        {
                            id: '6463',
                            type: 'PREQUALIFIED',
                            name: 'CASE_VOLUME_DISCOUNT',
                            amountType: 'Factor',
                            amount: 0.98,
                            priceAdjustment: -0.5,
                            effectiveFrom: '19000101',
                            effectiveTo: '21000101',
                        },
                    ],
                    isApplicable: false,
                },
            ],
        },
    ],
};

export const pciModifiedPriceMockPayload2 = {
    businessUnitNumber: '019',
    customerAccount: '622548',
    priceRequestDate: '20201020',
    requestStatuses: [

    ],
    products: [
        {
            statuses: [],
            volumePricingTiers: [
                {
                    customerPrequalifiedPrice: 22.24,
                    unitPrice: 22.24,
                    netPrice: 22.24,
                    eligibility: {
                        operator: 'Between',
                        lowerBound: 2,
                        upperBound: 5,
                    },
                    agreements: [

                    ],
                    discounts: [
                        {
                            id: '6463',
                            type: 'PREQUALIFIED',
                            name: 'CASE_VOLUME_DISCOUNT',
                            amountType: 'Factor',
                            amount: 0.99,
                            priceAdjustment: -0.25,
                            effectiveFrom: '19000101',
                            effectiveTo: '21000101',
                        },
                    ],
                    isApplicable: false,
                },
                {
                    customerPrequalifiedPrice: 22.24,
                    unitPrice: 22.24,
                    netPrice: 22.24,
                    eligibility: {
                        operator: 'Between',
                        lowerBound: 6,
                        upperBound: 8,
                    },
                    agreements: [

                    ],
                    discounts: [
                        {
                            id: '6463',
                            type: 'PREQUALIFIED',
                            name: 'CASE_VOLUME_DISCOUNT',
                            amountType: 'Factor',
                            amount: 0.99,
                            priceAdjustment: -0.25,
                            effectiveFrom: '19000101',
                            effectiveTo: '21000101',
                        },
                    ],
                    isApplicable: false,
                },
                {
                    customerPrequalifiedPrice: 21.99,
                    unitPrice: 21.99,
                    netPrice: 21.99,
                    eligibility: {
                        operator: '>=',
                        lowerBound: 9,
                    },
                    agreements: [

                    ],
                    discounts: [
                        {
                            id: '6463',
                            type: 'PREQUALIFIED',
                            name: 'CASE_VOLUME_DISCOUNT',
                            amountType: 'Factor',
                            amount: 0.98,
                            priceAdjustment: -0.5,
                            effectiveFrom: '19000101',
                            effectiveTo: '21000101',
                        },
                    ],
                    isApplicable: true,
                },
            ],
        },
    ],
};

export const pciModifiedPriceMockPayload3 = {
    businessUnitNumber: '019',
    customerAccount: '622548',
    priceRequestDate: '20201020',
    requestStatuses: [

    ],
    products: [
        {
            statuses: [],
            volumePricingTiers: [
                {
                    customerPrequalifiedPrice: 22.24,
                    unitPrice: 22.24,
                    netPrice: 22.24,
                    eligibility: {
                        operator: 'Between',
                        lowerBound: 2,
                        upperBound: 5,
                    },
                    agreements: [

                    ],
                    discounts: [
                        {
                            id: '6463',
                            type: 'PREQUALIFIED',
                            name: 'CASE_VOLUME_DISCOUNT',
                            amountType: 'Factor',
                            amount: 0.99,
                            priceAdjustment: -0.25,
                            effectiveFrom: '19000101',
                            effectiveTo: '21000101',
                        },
                    ],
                    isApplicable: false,
                },
                {
                    customerPrequalifiedPrice: 22.24,
                    unitPrice: 22.24,
                    netPrice: 22.24,
                    eligibility: {
                        operator: 'Between',
                        lowerBound: 6,
                        upperBound: 8,
                    },
                    agreements: [

                    ],
                    discounts: [
                        {
                            id: '6463',
                            type: 'PREQUALIFIED',
                            name: 'CASE_VOLUME_DISCOUNT',
                            amountType: 'Factor',
                            amount: 0.99,
                            priceAdjustment: -0.25,
                            effectiveFrom: '19000101',
                            effectiveTo: '21000101',
                        },
                    ],
                    isApplicable: false,
                },
                {
                    customerPrequalifiedPrice: 21.99,
                    unitPrice: 21.99,
                    netPrice: 21.99,
                    eligibility: {
                        operator: '>=',
                        lowerBound: 9,
                    },
                    agreements: [

                    ],
                    discounts: [
                        {
                            id: '6463',
                            type: 'PREQUALIFIED',
                            name: 'CASE_VOLUME_DISCOUNT',
                            amountType: 'Factor',
                            amount: 0.98,
                            priceAdjustment: -0.5,
                            effectiveFrom: '19000101',
                            effectiveTo: '21000101',
                        },
                    ],
                    isApplicable: false,
                },
            ],
        },
    ],
};

export const mockPCIPricingErrorResponse = {
    businessUnitNumber: '019',
    customerAccount: '622548',
    priceRequestDate: '20201020',
    requestStatuses: [

    ],
    products: [
        {
            statuses: [
                {
                    code: '801',
                    state: 'CRITICAL',
                    message: 'Product not found PCI Pricing',
                },
                {
                    code: '802',
                    state: 'INFO',
                    message: 'Some warning msg PCI Pricing',
                },
            ],
        },
    ],
};

export const mockProductPricingErrorResponse = {
    businessUnitNumber: '019',
    customerAccount: '622548',
    priceRequestDate: '20201020',
    requestStatuses: [

    ],
    products: [
        {
            statuses: [
                {
                    code: '101',
                    state: 'CRITICAL',
                    message: 'Product not found Product Pricing',
                },
                {
                    code: '102',
                    state: 'INFO',
                    message: 'Some warning msg Product Pricing',
                },
            ],
        },
    ],
};

export const pciPricesMockDataPriceSourceId = {
    businessUnitNumber: '019',
    customerAccount: '622548',
    customerType: 'TRS',
    priceRequestDate: '20201112',
    requestStatuses: [],
    products: [
        {
            supc: '0059420',
            splitFlag: false,
            shipSplitsOnlyFlag: false,
            priceZoneId: 4,
            quantity: 12,
            unitsPerCase: 6,
            perWeightFlag: false,
            averageNetWeight: 23.4000,
            grossPrice: 993.90,
            referencePriceRoundingAdjustment: 0.05,
            customerReferencePrice: 944.25,
            customerPrequalifiedPrice: 830.93,
            unitPrice: 830.93,
            netPrice: 830.93,
            agreementIndicators: [],
            priceSource: 97,
            minPrice: 0,
            minHandlingFlag: '',
            grossCommissionBasis: 0,
            handPricingAllowedFlag: false,
            originalSupc: null,
            subReasonCode: null,
            orderPrice: null,
            orderPriceType: null,
            statuses: [
                {
                    code: 216,
                    state: 'INFO',
                    message: 'Invalid base value for the commission base.',
                },
            ],
            priceRule: null,
            agreements: [],
            exception: null,
            discounts: [
                {
                    id: '50000',
                    type: 'REFERENCE_PRICE',
                    name: 'STRATEGIC_DISCOUNT',
                    amountType: 'Factor',
                    amount: 0.95,
                    priceAdjustment: -49.70,
                    effectiveFrom: '19000101',
                    effectiveTo: '21000101',
                },
                {
                    id: '107',
                    type: 'PREQUALIFIED',
                    name: 'NEW_CUSTOMER_DISCOUNT',
                    amountType: 'Factor',
                    amount: 0.9,
                    priceAdjustment: -94.43,
                    effectiveFrom: '19000101',
                    effectiveTo: '21000101',
                },
                {
                    id: '6463',
                    type: 'PREQUALIFIED',
                    name: 'CASE_VOLUME_DISCOUNT',
                    amountType: 'Factor',
                    amount: 0.98,
                    priceAdjustment: -18.89,
                    effectiveFrom: '19000101',
                    effectiveTo: '21000101',
                },
            ],
        },
    ],
};

export const mockRequestSignedUrl = {
    fileNames: [
        'fileName1',
        'fileName2',
    ],
};

export const mockErrorRequestSignedUrl = {
    fileNames: [
        'error_fileName1'
    ],
};

export const mockErrorResponseFromS3 = {
    "data": {
        "status": "success",
        "message": null,
        "data": [
            {
                fileName: 'fileName3_errors.txt',
                putUrl: 'https://batch-output.s3.amazonaws.com/fileName1?AWSAccessKeyId=ASIAQRLXWZJ',
            }
        ]}
};

export const mockErrorResponse = {
    "data": {
        "status": "success",
        "message": null,
        "data": [
            {
                fileName: 'fileName3.txt',
                putUrl: 'https://batch-output.s3.amazonaws.com/fileName1?AWSAccessKeyId=ASIAQRLXWZJ',
                action: 'error',
                minorErrorFileName: 'fileName3_errors.txt'
            }
        ]}
};

export const mockResponseSignedUrl = {
    "data": {
        "status": "success",
        "message": null,
        "data": [
            {
                fileName: 'fileName1',
                putUrl: 'https://batch-output.s3.amazonaws.com/fileName1?AWSAccessKeyId=ASIAQRLXWZJ',
            },
            {
                fileName: 'fileName2',
                putUrl: 'https://batch-output.s3.amazonaws.com/fileName2?AWSAccessKeyId=ASIAQRLXWZJ',
            },
        ]}
};

export const mockResponseFileList = {
    "data": {
        "status": "success",
        "message": null,
        "data": [
            {
                "fileName": "DevTestSplit_076_20200626_C.txt",
                "date": "2020-11-24T01:27:08.000Z",
                "size": 809,
                "owner": {
                    "DisplayName": "AWS_ACCT_SyscoGo-016",
                    "ID": "00669e0e1bbd0cbe09dada2537d2e918c6acf90c8d3619a1065d7735f7cf6b82"
                }
            },
            {
                "fileName": "DevTest1_006_20200616_C.txt",
                "date": "2020-11-24T01:27:13.000Z",
                "size": 369244,
                "owner": {
                    "DisplayName": "AWS_ACCT_SyscoGo-016",
                    "ID": "00669e0e1bbd0cbe09dada2537d2e918c6acf90c8d3619a1065d7735f7cf6b82"
                }
            }
        ]
    }
};
