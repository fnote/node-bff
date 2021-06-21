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
                name: 'MILK',
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
    customer_group: '1662',
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
    status: HTTP.OK,
    data: {
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
    },
};

export const mockSearchResponseWithCutomerAccount = {
    status: HTTP.OK,
    data: {
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
    },
};
