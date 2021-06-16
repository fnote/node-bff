export const seedGetItemAttributeGroupMockResponse = {
    data: {
        attributeGroups:[
            {
                name:'MILK',
                id:12213
            },
            {
                name:'FOOD STORAGE BAGS/SANDWICH BAGS/PAN LINERS',
                id:16892
            },
            {
                name:'FROZEN PASTA',
                id:12341
            }
        ]
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
            itemAttributeGroup: 'VEGETABLE PUREES/SEASONINGS/PASTES',
            itemAttributeGroupId: '123',
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
            itemAttributeGroup: 'VEGETABLE PUREES/SEASONINGS/PASTES',
            itemAttributeGroupId: '123',
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
