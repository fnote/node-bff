/**
 * Business unit authorization
 *
 * @author: adis0892 on 28/08/20
 * */

import BusinessUnitDao from '../../dao/businessUnitDao';
import {MAX_ROLE_HIERARCHY_NUMBER, ROLE_APP_ADMIN, ROLE_GENERAL_USER} from '../../util/constants';
import {getAuthorizationRoleHierarchy} from '../../config/configs';
import logger from '../../util/logger';

class AuthorizationService {
    businessUnitDetailsArray;

    loadBusinessUnitDetails = async () => {
        this.businessUnitDetailsArray = await BusinessUnitDao.getBusinessUnitDetails();
    };

    matchedValidBusinessUnitFromGivenList = (bUnit, bUnitDetailsList) => {
        if (bUnitDetailsList) {
            return bUnitDetailsList.filter((bUnitDetails) => bUnit === bUnitDetails.bunit_id);
        }
        return [];
    }

    matchedPricingTransformationEnabledBusinessUnit = (bUnit) => {
        if (this.businessUnitDetailsArray) {
            return this.businessUnitDetailsArray.filter((bUnitDetails) => bUnit === bUnitDetails.bunit_id
                && bUnitDetails.periscope_on === 'Y');
        }
        return [];
    }

    generatePricingTransformationEnabledAllBusinessUnit = () => {
        if (this.businessUnitDetailsArray) {
            return this.businessUnitDetailsArray.filter((bUnitDetails) => bUnitDetails.periscope_on === 'Y');
        }
        return [];
    }

    matchedBatchEnabledBusinessUnit = (bUnit) => {
        if (this.businessUnitDetailsArray) {
            return this.businessUnitDetailsArray.filter((bUnitDetails) => bUnit === bUnitDetails.bunit_id
                && bUnitDetails.batch_on === 'Y')
                .map((bUnitDetails) => bUnitDetails.bunit_id);
        }
        return [];
    }

    generateBatchEnabledAllBusinessUnit = () => {
        if (this.businessUnitDetailsArray) {
            return this.businessUnitDetailsArray.filter((bUnitDetails) => bUnitDetails.batch_on === 'Y')
                .map((bUnitDetails) => bUnitDetails.bunit_id);
        }
        return [];
    }

    getAuthorizedBusinessUnits = (opcoAttributeBunit, userRole) => {
        const authorizedBunitList = {};
        authorizedBunitList.authorizedPricingTransformationEnabledBunitList = [];
        authorizedBunitList.authorizedBatchEnabledBunitList = [];
        if (userRole === ROLE_APP_ADMIN || userRole === ROLE_GENERAL_USER) {
            // If these user roles, they should have access to all opcos
            logger.info(`User because of his user role: ${userRole} is given access to all opcos`);
            authorizedBunitList.authorizedPricingTransformationEnabledBunitList = this.generatePricingTransformationEnabledAllBusinessUnit();
            authorizedBunitList.authorizedBatchEnabledBunitList = this.generateBatchEnabledAllBusinessUnit();
            return authorizedBunitList;
        }
        if (!opcoAttributeBunit || !userRole) {
            // If AD opco attribute or user role is null or empty, then he should not have access to any opco
            logger.info(`User's opco attribute: ${opcoAttributeBunit} or user role: ${userRole} is empty so giving access to no opco`);
            return authorizedBunitList;
        }
        const matchedValidBusinessUnitList = this.matchedValidBusinessUnitFromGivenList(opcoAttributeBunit, this.businessUnitDetailsArray);

        if (matchedValidBusinessUnitList.length > 0) {
            authorizedBunitList.authorizedPricingTransformationEnabledBunitList =
                this.matchedPricingTransformationEnabledBusinessUnit(opcoAttributeBunit);
            authorizedBunitList.authorizedBatchEnabledBunitList =
                this.matchedBatchEnabledBusinessUnit(opcoAttributeBunit);

            if (authorizedBunitList.authorizedPricingTransformationEnabledBunitList.length === 0
                && authorizedBunitList.authorizedBatchEnabledBunitList.length === 0) {
                // Opco attribute matches one of the opcos but is not a pricing transformation enabled opco or batch enabled opco
                // so then he has access to no matching opco
                logger.info(`User's opco: ${opcoAttributeBunit} does not match with pricing transformation/ batch enabled opcos, 
                    so giving access to no opco`);
                return authorizedBunitList;
            }
                if (authorizedBunitList.authorizedPricingTransformationEnabledBunitList.length > 0) {
                    // Opco attribute matches one of the opcos and also is a pricing transformation enabled opco then return that opco
                    logger.info(`User's opco: ${opcoAttributeBunit} matches one of the pricing transformation enabled opco then giving access to that opco`);
                } else {
                    // Opco attribute matches one of the opcos but is not a pricing transformation enabled opco
                    logger.info(`User's opco: ${opcoAttributeBunit} does not match with pricing transformation enabled opcos, 
                    so giving access to no pricing transformation enabled opco`);
                }
                if (authorizedBunitList.authorizedBatchEnabledBunitList.length > 0) {
                    // Opco attribute matches one of the opcos and also is a batch enabled opco then return that opco
                    logger.info(`User's opco: ${opcoAttributeBunit} matches one of the batch enabled opco then giving access to that opco`);
                } else {
                    // Opco attribute matches one of the opcos but is not a batch enabled opco
                    logger.info(`User's opco: ${opcoAttributeBunit} does not match with batch enabled opcos, 
                    so giving access to no batch enabled opco`);
                }
                return authorizedBunitList;
        }
        // Opco attribute does not match to one of Sysco opcos, so it should be something like 000 (Corporate) or 440 (SBS)
        // so then give access to all opcos
        // In future, if we can identify what exactly these values can be, then can do a separate filtering
        logger.info(`User's opco: ${opcoAttributeBunit} does not match to one of Sysco opcos but a specific value, so giving access to all opcos`);
        authorizedBunitList.authorizedPricingTransformationEnabledBunitList = this.generatePricingTransformationEnabledAllBusinessUnit();
        authorizedBunitList.authorizedBatchEnabledBunitList = this.generateBatchEnabledAllBusinessUnit();
        return authorizedBunitList;
    }

    isAuthorizedRequest = (req, res) => {
        logger.info('Authenticating request');
        const {authResponse} = res.locals;
        const requestedBunit = req.body.businessUnitNumber;
        const {userDetailsData} = authResponse;

        if (userDetailsData && Object.keys(userDetailsData).length > 0) {
            const authorizedBunitListForTheUser = userDetailsData.authorizedPricingTransformationEnabledBunitList;
            const filteredOutBunits = this.matchedValidBusinessUnitFromGivenList(requestedBunit, authorizedBunitListForTheUser);
            if (filteredOutBunits.length > 0) {
                logger.info(`User's requested opco: [${requestedBunit}] matched with his authorized opcos, so request is authorized`);
                return true;
            }
            logger.warn(`User's requested opco: ${requestedBunit} does not match with his authorized opcos: ${authorizedBunitListForTheUser},
             so request is NOT authorized`);
        } else {
            logger.warn('User details data is empty for the request, so it is NOT authorized');
        }
        return false;
    };

    getTheRoleWithHighestAuthority = (rolesArray) => {
        const authorizationRoleHierarchy = getAuthorizationRoleHierarchy();
        let selectedAuthorizedRole = '';

        let selectedHierarchyNumber = MAX_ROLE_HIERARCHY_NUMBER;
        rolesArray.forEach((roleFromUserLogin) => {
            const hierarchyNumber = authorizationRoleHierarchy[roleFromUserLogin];

            if (selectedHierarchyNumber > hierarchyNumber) {
                selectedAuthorizedRole = roleFromUserLogin;
                selectedHierarchyNumber = hierarchyNumber;
            }
        });
        logger.info(`Out of all the user roles, user's highest authorized role was selected as ${selectedAuthorizedRole}`);
        return selectedAuthorizedRole;
    }
}

export default new AuthorizationService();
