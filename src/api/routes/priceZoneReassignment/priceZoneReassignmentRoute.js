// Core
import {Router} from 'express';
// Service
import seedService from '../../../service/seed/seedService';
import PriceZoneReassignmentService from '../../../service/priceZoneReassignment/priceZoneReassignmentService';
// Helper and Utils
import {
    handleSuccessResponse,
    handleUnsuccessfulResponse,
    isCustomerAccountDefined,
    validateCreatePriceZoneChangeRequest,
    validateSearchRequest,
    validateReviewPatchRequest,
    sortAttributeGroups,
} from '../../../helper/pzrHelper';
import logger from '../../../util/logger';
// Constants, Exception codes, Validation schema
import {
    ERROR_IN_CREATING_CIPZ_PRICE_ZONE_UPDATE,
    ERROR_IN_HANDLING_SEARCH_RESULTS,
    ERROR_IN_GETTING_CIPZ_PRICE_ZONE_SUBMITTED_REQ_DATA,
    ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA,
    ERROR_IN_HANDLING_CIPZ_PRICE_ZONE_UPDATE,
    ERROR_IN_RESPONSING_CIPZ_PRICE_ZONE_APPROVAL_REQ,
    ITEM_ATTRIBUTE_GROUPS,
    PZ_UPDATE_REQUESTS,
    PZ_UPDATES,
    PZ_SEARCH,
} from '../../../util/constants';

export default () => {
    const priceZoneReassignmentRouter = new Router();

    // SEED API - Get item attributes
    priceZoneReassignmentRouter.get(ITEM_ATTRIBUTE_GROUPS, async (req, res) => {
        try {
            const responseData = await seedService.getSeedItemAttributeGroupsData();
            sortAttributeGroups(responseData);
            logger.info(`Success Seed Data response received for att group: ${JSON.stringify(responseData.data)}`);
            handleSuccessResponse(res, responseData.data);
        } catch (error) {
            const errorMsg = error.errorDetails && error.errorDetails.message ? error.errorDetails.message
                : ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA;
            logger.error(`${errorMsg}: ${error} cause: ${error.stack} errorCode: ${error.errorCode}`);
            handleUnsuccessfulResponse(res, error, errorMsg);
        }
    });

    // SEED API - Search price zone details
    priceZoneReassignmentRouter.post(PZ_SEARCH, async (req, res) => {
        try {
            validateSearchRequest(req);
            logger.info(`Search price zone details: ${JSON.stringify(req.body)}`);
            let responseData;
            if (isCustomerAccountDefined(req.body)) {
                responseData = await seedService.getPriceZoneDetailsForCustomerAndItemAttributeGroup(req);
            } else {
                responseData = await seedService.getPriceZoneDetailsForCustomerGroupAndItemAttributeGroup(req);
            }
            logger.info('Success Seed Data response received for search');
            handleSuccessResponse(res, responseData.data);
        } catch (error) {
            const errorMsg = error.errorDetails && error.errorDetails.message ? error.errorDetails.message : ERROR_IN_HANDLING_SEARCH_RESULTS;
            logger.error(`${errorMsg}: ${error} cause: ${error.stack} errorCode: ${error.errorCode}`);
            handleUnsuccessfulResponse(res, error, errorMsg);
        }
    });

    // CIPZ API - Get price zone update summary
    priceZoneReassignmentRouter.get(PZ_UPDATE_REQUESTS, async (req, res) => {
        try {
            const responseData = await PriceZoneReassignmentService.getCIPZSubmittedRequestData(req.query);
            logger.info('Request success for get price zone update summary');
            handleSuccessResponse(res, responseData);
        } catch (error) {
            const errorMsg = ERROR_IN_GETTING_CIPZ_PRICE_ZONE_SUBMITTED_REQ_DATA;
            logger.error(`${errorMsg} : ${error} cause : ${error.stack} errorCode : ${error.errorCode}`);
            handleUnsuccessfulResponse(res, error, errorMsg);
        }
    });

    // CIPZ API - Store price zone update changes
    priceZoneReassignmentRouter.post(PZ_UPDATE_REQUESTS, async (req, res) => {
        try {
            validateCreatePriceZoneChangeRequest(req);
            logger.info(`Store price zone update changes request body: ${JSON.stringify(req.body)}`);
            const responseData = await PriceZoneReassignmentService.createPriceZoneChange(req);
            logger.info(`Success CIPZ create price zone update response received: ${JSON.stringify(responseData)}`);
            handleSuccessResponse(res, responseData);
        } catch (error) {
            const errMessage = error.errorDetails && error.errorDetails.message ? error.errorDetails.message
                : ERROR_IN_CREATING_CIPZ_PRICE_ZONE_UPDATE;
            logger.error(`${errMessage} : ${error} cause : ${error.stack} errorCode : ${error.errorCode}`);
            handleUnsuccessfulResponse(res, error, errMessage);
        }
    });

    // CIPZ API - Get all associated items and customers for a price zone change request
    priceZoneReassignmentRouter.get(PZ_UPDATES, async (req, res) => {
        try {
            const requestId = req.params.request_id;
            logger.info(`Get all associated items and customers for request id ${requestId}`);
            const responseData = await PriceZoneReassignmentService.getPriceZoneUpdatesData(req.query, requestId);
            logger.info('Success CIPZ API Get all associated items and customers for a price zone change request');
            handleSuccessResponse(res, responseData);
        } catch (error) {
            const errorMsg = ERROR_IN_HANDLING_CIPZ_PRICE_ZONE_UPDATE;
            logger.error(`${errorMsg} : ${error} cause : ${error.stack} errorCode : ${error.errorCode}`);
            handleUnsuccessfulResponse(res, error, errorMsg);
        }
    });

    // CIPZ API - Approve/Reject price zone change
    priceZoneReassignmentRouter.patch(PZ_UPDATE_REQUESTS, async (req, res) => {
        try {
            validateReviewPatchRequest(req);
            logger.info(`Patch request body: ${JSON.stringify(req.body)}`);
            const responseData = await PriceZoneReassignmentService.reviewSubmission(req.body);
            logger.info(`CIPZ API approval request is success: ${JSON.stringify(responseData)}`);
            handleSuccessResponse(res, responseData);
        } catch (error) {
            const errorMsg = ERROR_IN_RESPONSING_CIPZ_PRICE_ZONE_APPROVAL_REQ;
            logger.error(`${errorMsg} : ${error} cause : ${error.stack} errorCode : ${error.errorCode}`);
            handleUnsuccessfulResponse(res, error, errorMsg);
        }
    });

    return priceZoneReassignmentRouter;
};
