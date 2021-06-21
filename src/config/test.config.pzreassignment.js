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
