import AggregatedPricingDataService from '../pricing/aggregatedPricingDataService';
import CloudPricingDataFetchException from '../../exception/cloudPricingDataFetchException';
import InvalidRequestException from '../../exception/invalidRequestException';
import {INVALID_REQUEST_BODY} from '../../util/constants';
import {PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE} from '../../exception/exceptionCodes';
import {
    mockModifiedVolumePricingTiers,
    mockPCIPricingErrorResponse,
    mockProductPricingErrorResponse,
    pciModifiedPriceMockPayload1,
    pciModifiedPriceMockPayload2,
    pciModifiedPriceMockPayload3,
    pciPriceMockPayload,
    pciPriceMockPayloadNoVolTiers,
    pciPricesMockDataPriceSourceId,
    pricingDataMockErrorRequest,
    pricingDataMockRequest1,
} from '../../config/test.config';

describe('Aggregated Pricing Data Service request validation', () => {
    test('should return error when the request body is not valid', async () => {
        try {
            AggregatedPricingDataService
                .getAggregatedPricingData({body: pricingDataMockErrorRequest});
        } catch (e) {
            expect(e.name).toEqual(InvalidRequestException.name);
            expect(e.errorDetails.message).toEqual(INVALID_REQUEST_BODY);
            expect(e.errorCode).toEqual(PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE);
        }
    });
});

describe('Aggregated Pricing Data Service price source name selection', () => {
    test('should return correct price source name for the given price source Id', async () => {
        const priceSourceName = AggregatedPricingDataService.getPriceSourceName(
            { ...pciPricesMockDataPriceSourceId, products: [{ ...pciPricesMockDataPriceSourceId.products[0], priceSource: 97 }] },
        );
        expect(priceSourceName).toEqual('Price Advisor');
    });

    test('should return correct price source name for the given price source Id', async () => {
        const priceSourceName = AggregatedPricingDataService.getPriceSourceName(
            { ...pciPricesMockDataPriceSourceId, products: [{ ...pciPricesMockDataPriceSourceId.products[0], priceSource: 30 }] },
        );
        expect(priceSourceName).toEqual('Price Rule');
    });

    test('should return correct price source name for the given price source Id', async () => {
        const priceSourceName = AggregatedPricingDataService.getPriceSourceName(
            { ...pciPricesMockDataPriceSourceId, products: [{ ...pciPricesMockDataPriceSourceId.products[0], priceSource: 40 }] },
        );
        expect(priceSourceName).toEqual('Co Default');
    });

    test('should return correct price source name for the given price source Id', async () => {
        const priceSourceName = AggregatedPricingDataService.getPriceSourceName(
            { ...pciPricesMockDataPriceSourceId, products: [{ ...pciPricesMockDataPriceSourceId.products[0], priceSource: 45 }] },
        );
        expect(priceSourceName).toEqual('PR Default');
    });

    test('should return correct price source name for the given price source Id', async () => {
        const priceSourceName = AggregatedPricingDataService.getPriceSourceName(
            { ...pciPricesMockDataPriceSourceId, products: [{ ...pciPricesMockDataPriceSourceId.products[0], priceSource: 50 }] },
        );
        expect(priceSourceName).toEqual('Min Rule');
    });

    test('should return correct price source name for the given price source Id', async () => {
        const priceSourceName = AggregatedPricingDataService.getPriceSourceName(
            { ...pciPricesMockDataPriceSourceId, products: [{ ...pciPricesMockDataPriceSourceId.products[0], priceSource: 52 }] },
        );
        expect(priceSourceName).toEqual('Hand Price');
    });

    test('should return correct price source name for the given price source Id', async () => {
        const priceSourceName = AggregatedPricingDataService.getPriceSourceName(
            { ...pciPricesMockDataPriceSourceId, products: [{ ...pciPricesMockDataPriceSourceId.products[0], priceSource: 61 }] },
        );
        expect(priceSourceName).toEqual('GTD Price');
    });

    test('should return correct price source name for the given price source Id', async () => {
        const priceSourceName = AggregatedPricingDataService.getPriceSourceName(
            { ...pciPricesMockDataPriceSourceId, products: [{ ...pciPricesMockDataPriceSourceId.products[0], priceSource: 70 }] },
        );
        expect(priceSourceName).toEqual('Substitution');
    });

    test('should return correct price source name for the given price source Id', async () => {
        const priceSourceName = AggregatedPricingDataService.getPriceSourceName(
            { ...pciPricesMockDataPriceSourceId, products: [{ ...pciPricesMockDataPriceSourceId.products[0], priceSource: 96 }] },
        );
        expect(priceSourceName).toEqual('Exception');
    });
});

describe('Aggregated Pricing Data Service getApplicableTier', () => {
    test('should select applicable tier based on the quentity in between range', async () => {
        const response = await AggregatedPricingDataService
            .getApplicableTier({ ...pricingDataMockRequest1, requestedQuantity: 3 }, pciPriceMockPayload);
        expect(response).toEqual(pciModifiedPriceMockPayload1);
    });
    test('should select applicable tier based on the quentity in greater or equal range', async () => {
        const response = await AggregatedPricingDataService
            .getApplicableTier({ ...pricingDataMockRequest1, requestedQuantity: 9 }, pciPriceMockPayload);
        expect(response).toEqual(pciModifiedPriceMockPayload2);
    });
    test('should select applicable tier based on the quentity in greater or equal range', async () => {
        const response = await AggregatedPricingDataService
            .getApplicableTier({ ...pricingDataMockRequest1, requestedQuantity: 1 }, pciPriceMockPayload);
        expect(response).toEqual(pciModifiedPriceMockPayload3);
    });
    test('should return the same payload if volumeTiers are not available', async () => {
        const response = await AggregatedPricingDataService
            .getApplicableTier({ ...pricingDataMockRequest1, requestedQuantity: 9 }, pciPriceMockPayloadNoVolTiers);
        expect(response).toEqual(pciPriceMockPayloadNoVolTiers);
    });
});

describe('Aggregated Pricing Data Service checkCPResponseErrorStatus', () => {
    test('should return error when critical errors are found in the Product Pricing Response', async () => {
        try {
            AggregatedPricingDataService
                .checkCPResponseErrorStatus(mockProductPricingErrorResponse, pciModifiedPriceMockPayload1);
        } catch (e) {
            expect(e.name).toEqual(CloudPricingDataFetchException.name);
            expect(e.errorDetails.message).toEqual('Failed to fetch data from Cloud Pricing Endpoint, Product not found Product Pricing');
            expect(e.errorCode).toEqual('101');
        }
    });
    test('should return error when critical errors are found in the PCI Pricing Response', async () => {
        try {
            AggregatedPricingDataService
                .checkCPResponseErrorStatus(pciModifiedPriceMockPayload1, mockPCIPricingErrorResponse);
        } catch (e) {
            expect(e.name).toEqual(CloudPricingDataFetchException.name);
            expect(e.errorDetails.message).toEqual('Failed to fetch data from Cloud Pricing Endpoint, Product not found PCI Pricing');
            expect(e.errorCode).toEqual('801');
        }
    });
});

describe('Aggregated Pricing Data Service sort pricing tiers', () => {
    test('should return sorted pricing tiers', async () => {
        const sortedVolumeTierList = AggregatedPricingDataService.sortVolumeTierList(mockModifiedVolumePricingTiers);
        expect(sortedVolumeTierList[0].eligibility.lowerBound).toBeLessThan(sortedVolumeTierList[1].eligibility.lowerBound);
        expect(sortedVolumeTierList[0].eligibility.lowerBound).toBeLessThan(sortedVolumeTierList[2].eligibility.lowerBound);
        expect(sortedVolumeTierList[1].eligibility.lowerBound).toBeLessThan(sortedVolumeTierList[2].eligibility.lowerBound);
    });

    test('should return undefined when empty list passed', async () => {
        const sortedVolumeTierList = AggregatedPricingDataService.sortVolumeTierList([]);
        expect(sortedVolumeTierList).toEqual(undefined);
    });

    test('should return undefined when list is undefined', async () => {
        const sortedVolumeTierList = AggregatedPricingDataService.sortVolumeTierList(undefined);
        expect(sortedVolumeTierList).toEqual(undefined);
    });
});
