import * as HTTP from 'http-status-codes';

export const mockPzUpdateRequestBody = {
    requestId: 112,
    reviewer: {
       id: 'sams5625',
       givenName: 'Sanjaya',
       surname: 'Amarasinghe',
       email: 'sams5625@sysco.com',
    },
    reviewNote: '',
    status: 'APPROVED',
};

export const seedGetItemAttributeGroupMockResponse = {
    status: HTTP.OK,
    data: {
        attributeGroups: [
            {
                name: 'BREAD',
                id: 12213,
            },
            {
                name: 'FOOD STORAGE BAGS/SANDWICH BAGS/PAN LINERS',
                id: 16892,
            },
            {
                name: 'FROZEN PASTA',
                id: 12341,
            },
        ],
    },
};

export const mockSearchRequestWithCustomerGroup = {
    business_unit_number: '020',
    customer_group_id: '1662',
    item_attribute_group_id: '123',
    offset: 0,
    limit: 20,
};

export const mockSearchRequestWithCustomerAccount = {
    business_unit_number: '020',
    customer_account: '100001',
    item_attribute_group_id: '123',
    offset: 0,
    limit: 20,
};

export const mockSearchRequestWithoutOpCoId = {
    customer_account: '100001',
    item_attribute_group_id: '123',
    offset: 0,
    limit: 20,
};

export const mockSearchRequestWithoutCustomer = {
    business_unit_number: '020',
    item_attribute_group_id: '123',
    offset: 0,
    limit: 20,
};

export const mockSearchRequestWithBothCustomerAndCutomerGroup = {
    business_unit_number: '020',
    customer_account: '100001',
    customer_group_id: '1662',
    item_attribute_group_id: '123',
    offset: 0,
    limit: 20,
};

export const mockSearchRequestWithoutItemAttributeGroup = {
    business_unit_number: '020',
    customer_account: '100001',
    offset: 0,
    limit: 20,
};

const itemPriceZones = [
    {
       supc: '1000001',
       customer_account: '100001',
       product_name: 'Sysco MILK',
       customer_name: 'Bills Diary shop',
       price_zone: 3,
       existent_price_zones: [1, 2, 3, 4, 5],
       effective_from_date: '20210530',
       source: 'WTP model',
    },
    {
       supc: '1000002',
       customer_account: '100002',
       product_name: 'Sysco MILK',
       customer_name: 'Bills Diary shop',
       price_zone: 2,
       existent_price_ones: [1, 2, 3, 4, 5],
       effective_from_date: '20210530',
       source: 'WTP model',
    },
    {
       supc: '1000021',
       customer_account: '100005',
       product_name: 'Sysco MILK',
       customer_name: 'Bills Diary shop',
       price_zone: 3,
       existent_price_zones: [1, 2, 3, 4, 5],
       effective_from_date: '20210530',
       source: 'WTP model',
    },
 ];

export const mockSearchResponseWithCutomerGroup = {
    total_records: 3,
    offset: 1,
    limit: 20,
    data: {
        business_unit_number: '020',
        customer_group: '1662',
        item_attribute_group: 'MILK',
        item_attribute_group_id: '1234',
        item_price_zones: itemPriceZones,
    },
};

export const mockSearchResponseWithCutomerAccount = {
    total_records: 3,
    offset: 1,
    limit: 20,
    data: {
        business_unit_number: '020',
        customer_account: '123456',
        item_attribute_group: 'MILK',
        item_attribute_group_id: '1234',
        item_price_zones: itemPriceZones,
    },
};

export const mockCreatePriceZoneUpdateResponse = {
    data: {
        requestId: '112',
        status: 'PENDING_APPROVAL',
        createdTime: 1621837508,
    },
};

export const mockCreatePriceZoneUpdatePayload = {
    businessUnitNumber: '020',
    businessCenterItemAttributeGroup: 'VEGETABLE PUREES/SEASONINGS/PASTES',
    businessCenterItemAttributeGroupId: '12345',
    customerGroup: '8287',
    customerAccount: '700001',
    newPriceZone: 3,
    effectiveFromDate: '20210530',
    submissionNote: 'need to be submitted',
    submitter: {
       id: 'vvit5827',
       givenName: 'Vithulan',
       surname: 'MV',
       email: 'vvit5827@sysco.com',
    },
};
export const cipzApiGetSubmittedRequestMockResponse = {
    data: {
       totalRecords: 10,
       offset: 1,
       limit: 3,
       data: {
          pzUpdateRequests: [
             {
                id: 121,
                businessUnitNumber: '020',
                businessCenterItemAttributeGroup: 'VEGETABLE PUREES/SEASONINGS/PASTES',
                businessCenterItemAttributeGroupId: '12345',
                customerGroupId: '221',
                customerAccount: '700001',
                customerGroup: 'El Cerro',
                newPriceZone: 3,
                status: 'APPROVED',
                effectiveFromDate: '20210530',
                submitter: {
                   submitterId: 'vvit5827',
                   givenName: 'Vithulan',
                   surname: 'MV',
                   email: 'vvit5827@sysco.com',
                },
                summary: {
                   customerCount: 12,
                   supcCount: 123,
                },
                createdTime: 1621837508,
                approver: null,
                approverUpdatedTime: null,
                exportedTime: null,
             },
             {
                id: 122,
                businessUnitNumber: '020',
                businessCenterItemAttributeGroup: 'VEGETABLE PUREES/SEASONINGS/PASTES',
                businessCenterItemAttributeGroupId: '12345',
                customerGroupId: '221',
                customerAccount: '700001',
                customerGroup: 'El Cerro',
                newPriceZone: 3,
                status: 'PENDING_APPROVAL',
                effectiveFromDate: '20210530',
                submitter: {
                   submitterId: 'vvit5827',
                   givenName: 'Vithulan',
                   surname: 'MV',
                   email: 'vvit5827@sysco.com',
                },
                summary: {
                   customerCount: 12,
                   supcCount: 123,
                },
                createdTime: 1621837508,
                approver: null,
                approverUpdatedTime: null,
                exportedTime: null,
             },
             {
                id: 124,
                businessUnitNumber: '020',
                businessCenterItemAttributeGroup: 'VEGETABLE PUREES/SEASONINGS/PASTES',
                businessCenterItemAttributeGroupId: '12345',
                customerGroupId: '221',
                customerAccount: '700001',
                customerGroup: 'El Cerro',
                newPriceZone: 3,
                status: 'REJECTED',
                effectiveFromDate: '20210530',
                submitter: {
                   submitterId: 'vvit5827',
                   givenName: 'Vithulan',
                   surname: 'MV',
                   email: 'vvit5827@sysco.com',
                },
                summary: {
                   customerCount: 12,
                   supcCount: 123,
                },
                createdTime: 1621837508,
                approver: null,
                approverUpdatedTime: null,
                exportedTime: null,
             },
          ],
       },
    },
 };

 export const searchByCustomerMockResponse = {
     data: {
         totalRecords: 123,
         offset: 1,
         limit: 20,
         data: {
             businessUnitNumber: '020',
             customerGroupId: '112',
             customerGroup: 'El Cerro',
             businessCenterItemAttributeGroup: 'VEGETABLE PUREES/SEASONINGS/PASTES',
             businessCenterItemAttributeGroupId: '123',
             priceZones: [
                 {
                     supc: '1000001',
                     customerAccount: '100001',
                     productName: 'Sysco MILK',
                     CustomerName: 'Bills Diary shop',
                     priceZone: 3,
                     existentPriceZones: [1, 2, 5],
                     effectiveFromDate: '20210530',
                     source: 'WTP model',
                 },
                 {
                     supc: '1000010',
                     customerAccount: '100001',
                     productName: 'Sysco MILK',
                     CustomerName: 'Bills Diary shop',
                     priceZone: 3,
                     existentPriceZones: [1, 3, 4, 5],
                     effectiveFromDate: '20210530',
                     source: 'WTP model',
                 },
                 {
                     supc: '7000001',
                     customerAccount: '100001',
                     productName: 'Sysco MILK',
                     CustomerName: 'Bills Diary shop',
                     priceZone: 3,
                     existentPriceZones: [1, 2, 3, 4, 5],
                     effectiveFromDate: '20210530',
                     source: 'WTP model',
                 },
             ],
         },
     },
 };

 export const searchByCustomerGroupMockResponse = {
     data: {
         totalRecords: 123,
         offset: 1,
         limit: 20,
         data: {
             businessUnitNumber: '020',
             customerGroupId: '112',
             customerGroup: 'El Cerro',
             businessCenterItemAttributeGroup: 'VEGETABLE PUREES/SEASONINGS/PASTES',
             businessCenterItemAttributeGroupId: '123',
             priceZones: [
                 {
                     supc: '1000001',
                     customerAccount: '100001',
                     productName: 'Sysco MILK',
                     CustomerName: 'Bills Diary shop',
                     priceZone: 3,
                     existentPriceZones: [1, 2, 5],
                     effectiveFromDate: '20210530',
                     source: 'WTP model',
                 },
                 {
                     supc: '1000010',
                     customerAccount: '100001',
                     productName: 'Sysco MILK',
                     CustomerName: 'Bills Diary shop',
                     priceZone: 3,
                     existentPriceZones: [1, 3, 4, 5],
                     effectiveFromDate: '20210530',
                     source: 'WTP model',
                 },
                 {
                     supc: '7000001',
                     customerAccount: '100001',
                     productName: 'Sysco MILK',
                     CustomerName: 'Bills Diary shop',
                     priceZone: 3,
                     existentPriceZones: [1, 2, 3, 4, 5],
                     effectiveFromDate: '20210530',
                     source: 'WTP model',
                 },
             ],
         },
     },
 };

 export const cipzCreatePriceZoneChangeMockResponse = {
     data: {
         requestId: '112',
         requestStatus: 'PENDING_APPROVAL',
         createdTime: 1621837508,
     },
 };
 export const cipzApiGetPriceZoneUpdateMockData = {
    data: {
       totalRecords: 10,
       offset: 1,
       limit: 3,
       data: {
          pzUpdateRequests: [
             {
                supc: '122122',
                productName: 'Sysco MILK',
                customerAccount: '10001',
                customerName: 'Bills Diary Shop',
                requestId: 112,
                currentPriceZone: 2,
                newPriceZone: 3,
                effectiveFrom: '20210531',
                source: 'EAT',
             },
             {
                supc: '122122',
                productName: 'Sysco MILK',
                customerAccount: '10002',
                customerName: 'Bills Diary Shop',
                requestId: 112,
                currentPriceZone: 2,
                newPriceZone: 3,
                effectiveFrom: '20210531',
                source: 'EAT',
             },
             {
                supc: '122122',
                productName: 'Sysco MILK',
                customerAccount: '10003',
                customerName: 'Bills Diary Shop',
                requestId: 112,
                currentPriceZone: 2,
                newPriceZone: 3,
                effectiveFrom: '20210531',
                source: 'EAT',
             },
          ],
       },
    },
 };

 export const cipzApiRespnseToApproveRequestMockData = {
     data: {
        requestId: '112',
        requestStatus: 'APPROVED',
        approverUpdatedTime: 1621837508,
     },
 };
