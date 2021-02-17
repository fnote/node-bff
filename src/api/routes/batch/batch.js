/**
 * Exposes batch related routes
 *
 * @author: gkar5861 on 19/06/20
 * */
import {Router} from 'express';
import * as HttpStatus from 'http-status-codes';
import * as url from 'url';
import {createErrorResponse, createSuccessResponse} from '../../../mapper/responseMapper';
import logger from '../../../util/logger';
import {
    CORRELATION_ID_HEADER,
    ERROR_IN_DELETING_BATCH_JOBS,
    ERROR_IN_GETTING_BATCH_JOBS,
    ERROR_IN_GETTING_S3_INPUT_SIGNED_URL,
    ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL,
} from '../../../util/constants';
import BatchService from '../../../service/batch/batchService';
import {BATCH_API_DATA_FETCH_ERROR_CODE} from '../../../exception/exceptionCodes';
import {getCorrelationId} from '../../../util/correlationIdGenerator';
import {isEmptyRequestBody, validateRequestBody} from '../../../validator/validateRequest';

export default () => {
    const batchRouter = new Router({mergeParams: true});

    /**
     * Get write signed urls for input bucket
     */
    batchRouter.post('/files/signed-url/input', async (req, res) => {
        try {
            res.set(CORRELATION_ID_HEADER, getCorrelationId());

            isEmptyRequestBody(req.body);

            const {authResponse} = res.locals;
            const {userDetailsData} = authResponse;
            req.body.userId = userDetailsData.username;
            req.body.authorizedBunitList = userDetailsData.authorizedBatchEnabledBunitList;

            const responseData = await BatchService.generateFileUploadSignedUrl(req.body);
            res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
        } catch (error) {
            logger.error(`Error occurred in getting write signed urls. Error: ${error}`);
            const httpStatus = error.getStatus();
            const errorCode = error.getErrorCode() ? error.getErrorCode() : BATCH_API_DATA_FETCH_ERROR_CODE;
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, ERROR_IN_GETTING_S3_INPUT_SIGNED_URL, error, null, errorCode));
        }
    });

    /**
     * Get read signed urls for output bucket
     */
    batchRouter.post('/files/signed-url/output', async (req, res) => {
        try {
            res.set(CORRELATION_ID_HEADER, getCorrelationId());

            validateRequestBody(req.body);

            const {authResponse} = res.locals;
            const {userDetailsData} = authResponse;
            req.body.userId = userDetailsData.username;

            const responseData = await BatchService.generateFileDownloadSignedUrl(req.body);
            res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
        } catch (error) {
            logger.error(`Error occurred in getting signed urls. Error: ${error}`);
            const httpStatus = error.getStatus();
            const errorCode = error.getErrorCode() ? error.getErrorCode() : BATCH_API_DATA_FETCH_ERROR_CODE;
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL, error, null, errorCode));
        }
    });

    batchRouter.get('/jobs', async (req, res) => {
        res.set(CORRELATION_ID_HEADER, getCorrelationId());

        let userId;
        try {
            const {authResponse} = res.locals;
            const {userDetailsData} = authResponse;
            userId = userDetailsData.username;

            const queryParamsString = url.parse(req.url, true).search;

            const responseData = await BatchService.getBatchJobs(userId, queryParamsString);
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
        } catch (error) {
            logger.error(`Error occurred in retrieving batch job details of user: ${userId}. Error: ${error}`);
            const httpStatus = error.getStatus();
            const errorCode = error.getErrorCode() ? error.getErrorCode() : BATCH_API_DATA_FETCH_ERROR_CODE;
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, ERROR_IN_GETTING_BATCH_JOBS, error, null, errorCode));
        }
    });

    batchRouter.delete('/jobs/:jobId', async (req, res) => {
        res.set(CORRELATION_ID_HEADER, getCorrelationId());

        let userId;
        let jobId;
        try {
            const {authResponse} = res.locals;
            const {userDetailsData} = authResponse;
            userId = userDetailsData.username;
            jobId = req.params.jobId;

            const responseData = await BatchService.deleteJob(userId, jobId);
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
        } catch (error) {
            logger.error(`Error occurred in deleting the batch job: ${jobId}. Error: ${error}`);
            const httpStatus = error.getStatus();
            const errorCode = error.getErrorCode() ? error.getErrorCode() : BATCH_API_DATA_FETCH_ERROR_CODE;
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, ERROR_IN_DELETING_BATCH_JOBS, error, null, errorCode));
        }
    });

    return batchRouter;
};
