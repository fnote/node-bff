export const seedGetItemAttributeGroupMockResponse = {
    data: {
        attributeGroups:[
            {
                name:"MILK",
                id:12213
            },
            {
                name:"FOOD STORAGE BAGS/SANDWICH BAGS/PAN LINERS",
                id:16892
            },
            {
                name:"FROZEN PASTA",
                id:12341
            }
        ]
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