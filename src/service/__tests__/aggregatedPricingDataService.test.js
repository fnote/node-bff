import AggregatedPricingDataService from '../pricing/aggregatedPricingDataService';
import CloudPricingDataFetchException from '../../exception/cloudPricingDataFetchException';
import InvalidRequestException from '../../exception/invalidRequestException';
import { ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY } from '../../util/constants';
import {PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE} from '../../exception/exceptionCodes';
import {
    pricingDataMockRequest1, pricingDataMockErrorRequest, pciPriceMockPayload, pciPriceMockPayloadNoVolTiers,
    pciModifiedPriceMockPayload1, pciModifiedPriceMockPayload2, mockPCIPricingErrorResponse, mockProductPricingErrorResponse
} from '../../config/test.config'

describe('Aggregated Pricing Data Service request validation', () => {
    test('should return error when the request body is not valid', async () => {
        try {
            AggregatedPricingDataService
                .getAggregatedPricingData({body: pricingDataMockErrorRequest});
        } catch (e) {
            expect(e.name).toEqual(InvalidRequestException.name);
            expect(e.errorDetails.message).toEqual(ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY);
            expect(e.errorCode).toEqual(PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE);
        }
    });
});

describe('Aggregated Pricing Data Service _getApplicableTier', () => {
    test('should select applicable tier based on the quentity in between range', async () => {
        const response = await AggregatedPricingDataService
            ._getApplicableTier({ ...pricingDataMockRequest1, "requestedQuantity": 3 }, pciPriceMockPayload);
        expect(response).toEqual(pciModifiedPriceMockPayload1);
    });
    test('should select applicable tier based on the quentity in greater or equal range', async () => {
        const response = await AggregatedPricingDataService
            ._getApplicableTier({ ...pricingDataMockRequest1, "requestedQuantity": 9 }, pciPriceMockPayload);
        expect(response).toEqual(pciModifiedPriceMockPayload2);
    });
    test('should return the same payload if volumeTiers are not available', async () => {
        const response = await AggregatedPricingDataService
            ._getApplicableTier({ ...pricingDataMockRequest1, "requestedQuantity": 9 }, pciPriceMockPayloadNoVolTiers);
        expect(response).toEqual(pciPriceMockPayloadNoVolTiers);
    });
});

describe('Aggregated Pricing Data Service _checkCPResponseErrorStatus', () => {
    test('should return error when critical errors are found in the Product Pricing Response', async () => {
        try {
            AggregatedPricingDataService
                ._checkCPResponseErrorStatus(mockProductPricingErrorResponse, pciModifiedPriceMockPayload1);
        } catch (e) {
            expect(e.name).toEqual(CloudPricingDataFetchException.name);
            expect(e.errorDetails.message).toEqual('Failed to fetch data from Cloud Pricing Endpoint, Product not found Product Pricing');
            expect(e.errorCode).toEqual('101');
        }
    });
    test('should return error when critical errors are found in the PCI Pricing Response', async () => {
        try {
            AggregatedPricingDataService
                ._checkCPResponseErrorStatus(pciModifiedPriceMockPayload1, mockPCIPricingErrorResponse);
        } catch (e) {
            expect(e.name).toEqual(CloudPricingDataFetchException.name);
            expect(e.errorDetails.message).toEqual('Failed to fetch data from Cloud Pricing Endpoint, Product not found PCI Pricing');
            expect(e.errorCode).toEqual('801');
        }
    });
});