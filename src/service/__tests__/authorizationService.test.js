/**
 * BusinessUnit Authorization unit tests
 *
 * @author: adis0892 on 02/08/20
 * */
import {jest} from '@jest/globals';
import AuthorizationService from '../auth/authorizationService';
import BusinessUnitDao from '../../dao/businessUnitDao';
import {ROLE_APP_ADMIN, ROLE_CIPZ, ROLE_CIPZ_REVIEWER, ROLE_CIPZ_SUBMITTER, ROLE_GENERAL_USER, ROLE_REGULAR} from '../../util/constants';

jest.mock('../../dao/businessUnitDao');

const OTHER_ROLE = 'otherRole';

const bUnitDetailForOpco001 = {
    bunit_id: '001',
    bunit_name: 'Sysco Jackson',
    periscope_on: 'Y',
    batch_on: 'Y',
};

const bUnitDetailForOpco003 = {
    bunit_id: '003',
    bunit_name: 'Sysco Jacksonville',
    periscope_on: 'Y',
    batch_on: 'Y',
};

const bUnitDetailForOpco004 = {
    bunit_id: '004',
    bunit_name: 'Sysco Central California',
    periscope_on: 'Y',
    batch_on: 'N',
};

const bUnitDetailForOpco005 = {
    bunit_id: '005',
    bunit_name: 'Sysco Intermountain',
    periscope_on: 'N',
    batch_on: 'Y',
};

const bUnitDetailsArray = [
    bUnitDetailForOpco001,

    {
        bunit_id: '002',
        bunit_name: 'Sysco Atlanta',
        periscope_on: 'N',
        batch_on: 'N',
    },

    bUnitDetailForOpco003,
    bUnitDetailForOpco004,
    bUnitDetailForOpco005,
];

describe('Auth Service', () => {
    test('should send the bunit array when the passed bunit matches with one in the passed bunit details array',
        async () => {
            const filteredArray = AuthorizationService.matchedValidBusinessUnitFromGivenList('001', bUnitDetailsArray);
            expect(filteredArray).toEqual([bUnitDetailForOpco001]);
        });

    test('should send an empty array when the passed bunit does not match with one in the passed bunit details array',
        async () => {
            const filteredArray = AuthorizationService.matchedValidBusinessUnitFromGivenList('900', bUnitDetailsArray);
            expect(filteredArray).toEqual([]);
        });

    test('should send an empty array when the passed bunit details is empty', async () => {
        const filteredArray = AuthorizationService.matchedValidBusinessUnitFromGivenList('001', []);
        expect(filteredArray).toEqual([]);
    });

    test('should send the bunit array of the given bunit when the passed bunit matches one bunit that has periscope_on as Y '
        + 'and batch_on as Y and is in the bunit details array', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await AuthorizationService.loadBusinessUnitDetails();

        const pricingTransformationFilteredArray = AuthorizationService.matchedPricingTransformationEnabledBusinessUnit('001');
        const batchFilteredArray = AuthorizationService.matchedBatchEnabledBusinessUnit('001');
        expect(pricingTransformationFilteredArray).toEqual([bUnitDetailForOpco001]);
        expect(batchFilteredArray).toEqual(['001']);
    });

    test('should send an empty array when the passed bunit has periscope_on as N and batch_on as N although '
        + 'it is in the bunit details array',
        async () => {
            BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

            await AuthorizationService.loadBusinessUnitDetails();

            const pricingTransformationFilteredArray = AuthorizationService.matchedPricingTransformationEnabledBusinessUnit('002');
            const batchFilteredArray = AuthorizationService.matchedBatchEnabledBusinessUnit('002');
            expect(pricingTransformationFilteredArray).toEqual([]);
            expect(batchFilteredArray).toEqual([]);
        });

    test('should send an empty array when the passed bunit does not match a bunit in the bunit details array', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await AuthorizationService.loadBusinessUnitDetails();

        const pricingTransformationFilteredArray = AuthorizationService.matchedPricingTransformationEnabledBusinessUnit('900');
        const batchFilteredArray = AuthorizationService.matchedBatchEnabledBusinessUnit('900');
        expect(pricingTransformationFilteredArray).toEqual([]);
        expect(batchFilteredArray).toEqual([]);
    });

    test('should send an empty array when the bunit details array is null', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(null);

        await AuthorizationService.loadBusinessUnitDetails();

        const pricingTransformationFilteredArray = AuthorizationService.matchedPricingTransformationEnabledBusinessUnit('001');
        const batchFilteredArray = AuthorizationService.matchedBatchEnabledBusinessUnit('001');
        expect(pricingTransformationFilteredArray).toEqual([]);
        expect(batchFilteredArray).toEqual([]);
    });

    test('should send the bunit array where periscope_on as Y',
        async () => {
            BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

            await AuthorizationService.loadBusinessUnitDetails();

            const filteredArray = AuthorizationService.generatePricingTransformationEnabledAllBusinessUnit();
            expect(filteredArray).toEqual([bUnitDetailForOpco001, bUnitDetailForOpco003, bUnitDetailForOpco004]);
        });

    test('should send the bunit array where batch_on as Y',
        async () => {
            BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

            await AuthorizationService.loadBusinessUnitDetails();

            const filteredArray = AuthorizationService.generateBatchEnabledAllBusinessUnit();
            expect(filteredArray).toEqual(['001', '003', '005']);
        });

    test('should send an empty array when all bunits have periscope_on as N',
        async () => {
            const bUnitDetailsArrayWithNoPerisoceOnYes = [
                {
                    bunit_id: '002',
                    bunit_name: 'Sysco Atlanta',
                    periscope_on: 'N',
                },
                {
                    bunit_id: '004',
                    bunit_name: 'Sysco Central California',
                    periscope_on: 'N',
                },
                {
                    bunit_id: '005',
                    bunit_name: 'Sysco Intermountain',
                    periscope_on: 'N',
                },
        ];

        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArrayWithNoPerisoceOnYes);

        await AuthorizationService.loadBusinessUnitDetails();

        const filteredArray = AuthorizationService.generatePricingTransformationEnabledAllBusinessUnit();
        expect(filteredArray).toEqual([]);
    });

    test('should send an empty array when called bUnitDetailsArray is empty', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue('');

        await AuthorizationService.loadBusinessUnitDetails();

        const filteredArray = AuthorizationService.generatePricingTransformationEnabledAllBusinessUnit();
        expect(filteredArray).toEqual([]);
    });

    test('should send the bunit array of that have periscope_on and batch_on as Y when called with user role: ROLE_APP_ADMIN',
        async () => {
            BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

            await AuthorizationService.loadBusinessUnitDetails();

            const filteredArray = AuthorizationService.getAuthorizedBusinessUnits('001', ROLE_APP_ADMIN);
            const pricingTransformationFilteredArray = filteredArray.authorizedPricingTransformationEnabledBunitList;
            const batchFilteredArray = filteredArray.authorizedBatchEnabledBunitList;

            expect(pricingTransformationFilteredArray).toEqual([bUnitDetailForOpco001, bUnitDetailForOpco003, bUnitDetailForOpco004]);
            expect(batchFilteredArray).toEqual(['001', '003', '005']);
        });

    test('should send the bunit array of that have periscope_on and batch_on as Y when called with user role: ROLE_GENERAL_USER',
        async () => {
            BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

            await AuthorizationService.loadBusinessUnitDetails();

            const filteredArray = AuthorizationService.getAuthorizedBusinessUnits('001', ROLE_GENERAL_USER);
            const pricingTransformationFilteredArray = filteredArray.authorizedPricingTransformationEnabledBunitList;
            const batchFilteredArray = filteredArray.authorizedBatchEnabledBunitList;

            expect(pricingTransformationFilteredArray).toEqual([bUnitDetailForOpco001, bUnitDetailForOpco003, bUnitDetailForOpco004]);
            expect(batchFilteredArray).toEqual(['001', '003', '005']);
        });

    test('should send an empty array when opcoAtrribute is passed as null', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await AuthorizationService.loadBusinessUnitDetails();

        const filteredArray = AuthorizationService.getAuthorizedBusinessUnits(null, OTHER_ROLE);
        const pricingTransformationFilteredArray = filteredArray.authorizedPricingTransformationEnabledBunitList;
        const batchFilteredArray = filteredArray.authorizedBatchEnabledBunitList;

        expect(pricingTransformationFilteredArray).toEqual([]);
        expect(batchFilteredArray).toEqual([]);
    });

    test('should send an empty array when opcoAtrribute is passed empty', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await AuthorizationService.loadBusinessUnitDetails();

        const filteredArray = AuthorizationService.getAuthorizedBusinessUnits('', OTHER_ROLE);
        const pricingTransformationFilteredArray = filteredArray.authorizedPricingTransformationEnabledBunitList;
        const batchFilteredArray = filteredArray.authorizedBatchEnabledBunitList;

        expect(pricingTransformationFilteredArray).toEqual([]);
        expect(batchFilteredArray).toEqual([]);
    });

    test('should send the bunit array with opco details of users authorized opoco when opcoAtrribute has a matching value '
        + 'that satisfies the authorization condition: one matching opco and it is periscope_on and baych_on Y', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await AuthorizationService.loadBusinessUnitDetails();

        const filteredArray = AuthorizationService.getAuthorizedBusinessUnits('001', OTHER_ROLE);
        const pricingTransformationFilteredArray = filteredArray.authorizedPricingTransformationEnabledBunitList;
        const batchFilteredArray = filteredArray.authorizedBatchEnabledBunitList;
        expect(pricingTransformationFilteredArray).toEqual([bUnitDetailForOpco001]);
        expect(batchFilteredArray).toEqual(['001']);
    });

    test('should send the bunit array with no opco details of users authorized opoco when opcoAtrribute has a matching value '
        + 'that satisfies the authorization condition: one matching opco and it is periscope_on and baych_on N', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await AuthorizationService.loadBusinessUnitDetails();

        const filteredArray = AuthorizationService.getAuthorizedBusinessUnits('002', OTHER_ROLE);
        const pricingTransformationFilteredArray = filteredArray.authorizedPricingTransformationEnabledBunitList;
        const batchFilteredArray = filteredArray.authorizedBatchEnabledBunitList;
        expect(pricingTransformationFilteredArray).toEqual([]);
        expect(batchFilteredArray).toEqual([]);
    });

    test('should send an empty array when passed bunit it a matching one to the list of bunit but is not periscope_on N'
        + ' and batch_on Y',
        async () => {
            BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

            await AuthorizationService.loadBusinessUnitDetails();

            const filteredArray = AuthorizationService.getAuthorizedBusinessUnits('005', OTHER_ROLE);
            const pricingTransformationFilteredArray = filteredArray.authorizedPricingTransformationEnabledBunitList;
            const batchFilteredArray = filteredArray.authorizedBatchEnabledBunitList;
            expect(pricingTransformationFilteredArray).toEqual([]);
            expect(batchFilteredArray).toEqual(['005']);
        });

    test('should send an empty array when passed bunit it a matching one to the list of bunit but is not periscope_on Y'
        + ' and batch_on N',
        async () => {
            BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

            await AuthorizationService.loadBusinessUnitDetails();

            const filteredArray = AuthorizationService.getAuthorizedBusinessUnits('004', OTHER_ROLE);
            const pricingTransformationFilteredArray = filteredArray.authorizedPricingTransformationEnabledBunitList;
            const batchFilteredArray = filteredArray.authorizedBatchEnabledBunitList;
            expect(pricingTransformationFilteredArray).toEqual([bUnitDetailForOpco004]);
            expect(batchFilteredArray).toEqual([]);
        });

    test('should send all the periscope_on Y bunit when the passed opco does not match one of the given bunit details array '
        + 'because it would be an indicator like 000: corporate, 341: sysco labs', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await AuthorizationService.loadBusinessUnitDetails();

        const filteredArray = AuthorizationService.getAuthorizedBusinessUnits('341', OTHER_ROLE);
        const pricingTransformationFilteredArray = filteredArray.authorizedPricingTransformationEnabledBunitList;
        const batchFilteredArray = filteredArray.authorizedBatchEnabledBunitList;
        expect(pricingTransformationFilteredArray).toEqual([bUnitDetailForOpco001, bUnitDetailForOpco003, bUnitDetailForOpco004]);
        expect(batchFilteredArray).toEqual(['001', '003', '005']);
    });

    test('should send isAuthorized as true when user requested for an opco that he is authorized to', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        const req = {
            body: {
                businessUnitNumber: '001',
            },
        };

        const res = {
            locals: {
                authResponse: {
                    userDetailsData: {
                        authorizedPricingTransformationEnabledBunitList: [
                            {
                                bunit_id: '001',
                                bunit_name: 'Sysco Jackson',
                                periscope_on: 'Y',
                            },
                            {
                                bunit_id: '003',
                                bunit_name: 'Sysco Jacksonville',
                                periscope_on: 'Y',
                            },
                        ],
                        authorizedBatchEnabledBunitList: ['001', '002'],
                        email: 'firstName.secondName@syscolabs.com',
                        firstName: 'firstName',
                        jobTitle: 'jobTitle',
                        lastName: 'secondName',
                        username: 'username',
                    },
                },
            },
        };

        await AuthorizationService.loadBusinessUnitDetails();

        const isAuthorized = AuthorizationService.isAuthorizedRequest(req, res);
        expect(isAuthorized).toEqual(true);
    });

    test('should send isAuthorized as false when user requested for an opco that he is not authorized to', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        const req = {
            body: {
                businessUnitNumber: '005',
            },
        };

        const res = {
            locals: {
                authResponse: {
                    userDetailsData: {
                        authorizedPricingTransformationEnabledBunitList: [
                            {
                                bunit_id: '001',
                                bunit_name: 'Sysco Jackson',
                                periscope_on: 'Y',
                            },
                            {
                                bunit_id: '003',
                                bunit_name: 'Sysco Jacksonville',
                                periscope_on: 'Y',
                            },
                        ],
                        authorizedBatchEnabledBunitList: ['001', '002'],
                        email: 'firstName.secondName@syscolabs.com',
                        firstName: 'firstName',
                        jobTitle: 'jobTitle',
                        lastName: 'secondName',
                        username: 'username',
                    },
                },
            },
        };

        await AuthorizationService.loadBusinessUnitDetails();

        const isAuthorized = AuthorizationService.isAuthorizedRequest(req, res);
        expect(isAuthorized).toEqual(false);
    });

    test('should send isAuthorized as false when user details in users auth response is not defined', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        const req = {
            body: {
                businessUnitNumber: '005',
            },
        };

        const res = {
            locals: {
                authResponse: {},
            },
        };

        await AuthorizationService.loadBusinessUnitDetails();

        const isAuthorized = AuthorizationService.isAuthorizedRequest(req, res);
        expect(isAuthorized).toEqual(false);
    });

    test('should send isAuthorized as false when authorizedPricingTransformationEnabledBunitList is empty in users auth response', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        const req = {
            body: {
                businessUnitNumber: '005',
            },
        };

        const res = {
            locals: {
                authResponse: {
                    userDetailsData: {
                        authorizedPricingTransformationEnabledBunitList: [],
                        authorizedBatchEnabledBunitList: [],
                        email: 'firstName.secondName@syscolabs.com',
                        firstName: 'firstName',
                        jobTitle: 'jobTitle',
                        lastName: 'secondName',
                        username: 'username',
                    },
                },
            },
        };

        await AuthorizationService.loadBusinessUnitDetails();

        const isAuthorized = AuthorizationService.isAuthorizedRequest(req, res);
        expect(isAuthorized).toEqual(false);
    });

    test('should send isAuthorized as false when authorizedPricingTransformationEnabledBunitList is not defined in users auth response', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        const req = {
            body: {
                businessUnitNumber: '005',
            },
        };

        const res = {
            locals: {
                authResponse: {
                    userDetailsData: {
                        email: 'firstName.secondName@syscolabs.com',
                        firstName: 'firstName',
                        jobTitle: 'jobTitle',
                        lastName: 'secondName',
                        username: 'username',
                    },
                },
            },
        };

        await AuthorizationService.loadBusinessUnitDetails();

        const isAuthorized = AuthorizationService.isAuthorizedRequest(req, res);
        expect(isAuthorized).toEqual(false);
    });

    test('should send ROLE_APP_ADMIN when passed other roles is less priority in the hierarchy', async () => {
        const rolesArrayFromUser = [ROLE_APP_ADMIN, ROLE_GENERAL_USER];
        const selectedRole = AuthorizationService.getTheRoleWithHighestAuthority(rolesArrayFromUser, ROLE_REGULAR);
        expect(selectedRole).toEqual(ROLE_APP_ADMIN);
    });

    test('should send ROLE_GENERAL_USER when passed other roles is less priority in the hierarchy', async () => {
        const rolesArrayFromUser = [ROLE_GENERAL_USER, OTHER_ROLE];
        const selectedRole = AuthorizationService.getTheRoleWithHighestAuthority(rolesArrayFromUser, ROLE_REGULAR);
        expect(selectedRole).toEqual(ROLE_GENERAL_USER);
    });

    test('should send an empty role when no role array is passed', async () => {
        const rolesArrayFromUser = [];
        const selectedRole = AuthorizationService.getTheRoleWithHighestAuthority(rolesArrayFromUser, ROLE_REGULAR);
        expect(selectedRole).toEqual('');
    });

    test('should send ROLE_CIPZ_REVIEWER when passed other roles is less priority in the hierarchy', async () => {
        const rolesArrayFromUser = [ROLE_CIPZ_REVIEWER, ROLE_CIPZ_SUBMITTER];
        const selectedRole = AuthorizationService.getTheRoleWithHighestAuthority(rolesArrayFromUser, ROLE_CIPZ);
        expect(selectedRole).toEqual(ROLE_CIPZ_REVIEWER);
    });

    test('should send ROLE_CIPZ_SUBMITTER when passed other roles is less priority in the hierarchy', async () => {
        const rolesArrayFromUser = [ROLE_CIPZ_SUBMITTER, OTHER_ROLE, ROLE_APP_ADMIN];
        const selectedRole = AuthorizationService.getTheRoleWithHighestAuthority(rolesArrayFromUser, ROLE_CIPZ);
        expect(selectedRole).toEqual(ROLE_CIPZ_SUBMITTER);
    });

    test('should send an empty role when no role array is passed for cipz roles', async () => {
        const rolesArrayFromUser = [];
        const selectedRole = AuthorizationService.getTheRoleWithHighestAuthority(rolesArrayFromUser, ROLE_CIPZ);
        expect(selectedRole).toEqual('');
    });

    test('should send the superior cipz role when cipz roles and regular roles present in array but cipz selected', async () => {
        const rolesArrayFromUser = [ROLE_CIPZ_SUBMITTER, OTHER_ROLE, ROLE_APP_ADMIN];
        const selectedRole = AuthorizationService.getTheRoleWithHighestAuthority(rolesArrayFromUser, ROLE_CIPZ);
        expect(selectedRole).toEqual(ROLE_CIPZ_SUBMITTER);
    });

    test('should send the superior regular role when cipz roles and regular roles present in array but regular selected', async () => {
        const rolesArrayFromUser = [ROLE_CIPZ_SUBMITTER, OTHER_ROLE, ROLE_APP_ADMIN];
        const selectedRole = AuthorizationService.getTheRoleWithHighestAuthority(rolesArrayFromUser, ROLE_REGULAR);
        expect(selectedRole).toEqual(ROLE_APP_ADMIN);
    });
});
