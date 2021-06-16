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
export const cipzApiGetSubmittedRequestMockResponse = {
    data: {
        "totalRecords":10,
        "offset":1,
        "limit":3,
        data:{
           pzUpdateRequests:[
              {
                 "id":121,
                 "businessUnitNumber":"020",
                 "itemAttributeGroup":"VEGETABLE PUREES/SEASONINGS/PASTES",
                 "itemAttributeGroupId":"12345",
                 "customerGroupId":"221",
                 "customerAccount":"700001",
                 "customerGroup":"El Cerro",
                 "newPriceZone":3,
                 "status":"APPROVED",
                 "effectiveFromDate":"20210530",
                 "submitter":{
                    "submitterId":"vvit5827",
                    "givenName":"Vithulan",
                    "surname":"MV",
                    "email":"vvit5827@sysco.com"
                 },
                 "summary":{
                     customerCount: 12,
                     supcCount: 123
                 },
                 "createdTime":1621837508,
                 "approver":null,
                 "approverUpdatedTime":null,
                 "exportedTime":null
              },
              {
                 "id":122,
                 "businessUnitNumber":"020",
                 "itemAttributeGroup":"VEGETABLE PUREES/SEASONINGS/PASTES",
                 "itemAttributeGroupId":"12345",
                 "customerGroupId":"221",
                 "customerAccount":"700001",
                 "customerGroup":"El Cerro",
                 "newPriceZone":3,
                 "status":"PENDING_APPROVAL",
                 "effectiveFromDate":"20210530",
                 "submitter":{
                    "submitterId":"vvit5827",
                    "givenName":"Vithulan",
                    "surname":"MV",
                    "email":"vvit5827@sysco.com"
                 },
                 "summary":{
                     customerCount: 12,
                     supcCount: 123
                 },
                 "createdTime":1621837508,
                 "approver":null,
                 "approverUpdatedTime":null,
                 "exportedTime":null
              },
              {
                 "id":124,
                 "businessUnitNumber":"020",
                 "itemAttributeGroup":"VEGETABLE PUREES/SEASONINGS/PASTES",
                 "itemAttributeGroupId":"12345",
                 "customerGroupId":"221",
                 "customerAccount":"700001",
                 "customerGroup":"El Cerro",
                 "newPriceZone":3,
                 "status":"REJECTED",
                 "effectiveFromDate":"20210530",
                 "submitter":{
                    "submitterId":"vvit5827",
                    "givenName":"Vithulan",
                    "surname":"MV",
                    "email":"vvit5827@sysco.com"
                 },
                 "summary":{
                     customerCount: 12,
                     supcCount: 123
                 },
                 "createdTime":1621837508,
                 "approver":null,
                 "approverUpdatedTime":null,
                 "exportedTime":null
              }
           ]
        }
     }
};

export const cipzApiGetPriceZoneUpdateMockData = {
    data : {
        "totalRecords":10,
        "offset":1,
        "limit":3,
        "data":{
           "pzUpdateRequests":[
              {
                 "supc":"122122",
                 "productName": "Sysco MILK",
                 "customerAccount":"10001",
                 "customerName": "Bills Diary Shop",
                 "requestId":112,
                 "currentPriceZone":2,
                 "newPriceZone":3,
                 "effectiveFrom":"20210531",
                 "source": "EAT"
              },
              {
                 "supc":"122122",
                 "productName": "Sysco MILK",
                 "customerAccount":"10002",
                 "customerName": "Bills Diary Shop",
                 "requestId":112,
                 "currentPriceZone":2,
                 "newPriceZone":3,
                 "effectiveFrom":"20210531",
                 "source": "EAT"
              },
              {
                 "supc":"122122",
                 "productName": "Sysco MILK",
                 "customerAccount":"10003",
                 "customerName": "Bills Diary Shop",
                 "requestId":112,
                 "currentPriceZone":2,
                 "newPriceZone":3,
                 "effectiveFrom":"20210531",
                 "source": "EAT"
              }
           ]
        }
     }
};

export const cipzCreatePriceZoneChangeMockResponse = {
    data: {
        requestId: '112',
        requestStatus: 'PENDING_APPROVAL',
        createdTime: 1621837508,
    },
};
