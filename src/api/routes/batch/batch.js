/**
 * Exposes batch related routes
 *
 * @author: gkar5861 on 19/06/20
 * */
import {Router} from 'express';
import * as HttpStatus from 'http-status-codes';
import {createErrorResponse, createSuccessResponse} from '../../../mapper/responseMapper';
import logger from '../../../util/logger';
import {
    CORRELATION_ID_HEADER,
    ERROR_IN_GETTING_S3_DELETING_FILES,
    ERROR_IN_GETTING_S3_FILES,
    ERROR_IN_GETTING_S3_INPUT_SIGNED_URL,
    ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL,
    FILE_SOURCE_INPUT,
} from '../../../util/constants';
import BatchService from '../../../service/batch/batchService';
import {BATCH_API_DATA_FETCH_ERROR_CODE} from "../../../exception/exceptionCodes";
import {validateSource} from "../../../validator/validateRequest";
import {getCorrelationId} from "../../../util/correlationIdGenerator";

export default () => {
    const batchRouter = new Router({mergeParams: true});

    batchRouter.post('/signed-url/:source', async (req, res) => {
        const {source} = req.params;
        try {
            validateSource(source);
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            if (source === FILE_SOURCE_INPUT) {
                const responseData = await BatchService.generateInputSignUrl(req.body);
                res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
            } else {
                const responseData = await BatchService.generateOutputSignUrl(req.body);
                res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
            }
        } catch (error) {
            logger.error(`Error occurred in getting signed urls. Error: ${error}`);
            const errMessage = source === FILE_SOURCE_INPUT ? ERROR_IN_GETTING_S3_INPUT_SIGNED_URL
                : ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL;
            const httpStatus = error.getStatus();
            const errorCode = error.getErrorCode() ? error.getErrorCode() : BATCH_API_DATA_FETCH_ERROR_CODE;
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, errMessage, error, null, errorCode));
        }
    });

    batchRouter.get('/files/:source', async (req, res) => {
        const {source} = req.params;
        try {
            const responseData = await BatchService.getFiles(source);
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
        } catch (error) {
            logger.error(`Error occurred in getting the file list. Error: ${error}`);
            const errMessage = `${ERROR_IN_GETTING_S3_FILES} from bucket: ${source}`;
            const httpStatus = error.getStatus();
            const errorCode = error.getErrorCode() ? error.getErrorCode() : BATCH_API_DATA_FETCH_ERROR_CODE;
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, errMessage, error, null, errorCode));
        }
    });

    batchRouter.get('/files/:source/:prefix', async (req, res) => {
        const {source} = req.params;
        const {prefix} = req.params;
        try {
            const responseData = await BatchService.getFilesByPrefix(source, prefix);
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
        } catch (error) {
            logger.error(`Error occurred in getting the file list by prefix. Error: ${error}`);
            const errMessage = `${ERROR_IN_GETTING_S3_FILES} from bucket: ${source}`;
            const httpStatus = error.getStatus();
            const errorCode = error.getErrorCode() ? error.getErrorCode() : BATCH_API_DATA_FETCH_ERROR_CODE;
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, errMessage, error, null, errorCode));
        }
    });

    batchRouter.delete('/files/:source', async (req, res) => {
        const {source} = req.params;
        try {
            const responseData = await BatchService.deleteFiles(source, req.body);
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
        } catch (error) {
            logger.error(`Error occurred in getting the file list. Error: ${error}`);
            const errMessage = `${ERROR_IN_GETTING_S3_DELETING_FILES} from bucket: ${source}`;
            const httpStatus = error.getStatus();
            const errorCode = error.getErrorCode() ? error.getErrorCode() : BATCH_API_DATA_FETCH_ERROR_CODE;
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, errMessage, error, null, errorCode));
        }
    });

    return batchRouter;
};
