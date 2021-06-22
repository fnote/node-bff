export const seedGetItemAttributeGroupMockResponse = {
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
               itemAttributeGroup: 'VEGETABLE PUREES/SEASONINGS/PASTES',
               itemAttributeGroupId: '12345',
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
               itemAttributeGroup: 'VEGETABLE PUREES/SEASONINGS/PASTES',
               itemAttributeGroupId: '12345',
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
               itemAttributeGroup: 'VEGETABLE PUREES/SEASONINGS/PASTES',
               itemAttributeGroupId: '12345',
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

export const searchByCustomerMockResponse = {
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

export const searchByCustomerGroupMockResponse = {
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
   requestId: '112',
   requestStatus: 'APPROVED',
   approverUpdatedTime: 1621837508,
};
