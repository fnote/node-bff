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
    ERROR_IN_GETTING_S3_DELETING_FILES,
    ERROR_IN_GETTING_S3_FILES,
    ERROR_IN_GETTING_S3_INPUT_SIGNED_URL,
    ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL,
    FILE_SOURCE_INPUT,
    FILE_SOURCE_OUTPUT,
    INVALID_S3_BUCKET_SOURCE,
} from '../../../util/constants';
import BatchService from '../../../service/batch/batchService';
import {BATCH_API_DATA_FETCH_ERROR_CODE, INVALID_S3_SOURCE} from "../../../exception/exceptionCodes";

export default () => {
    const batchRouter = new Router({mergeParams: true});

    batchRouter.post('/signed-url/:source', async (req, res) => {
        const {source} = req.params;
        try {
            if (source === FILE_SOURCE_INPUT) {
                const responseData = await BatchService.generateInputSignUrl(req.body);
                res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
            } else if (source === FILE_SOURCE_OUTPUT) {
                const responseData = await BatchService.generateOutputSignUrl(req.body);
                res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
            } else {
                logger.error('Invalid source found while generating signed urls');
                res.status(HttpStatus.BAD_REQUEST)
                    .send(createErrorResponse(HttpStatus.BAD_REQUEST, INVALID_S3_BUCKET_SOURCE,
                        null, null, INVALID_S3_SOURCE));
            }
        } catch (error) {
            logger.error(`Error occurred in getting signed urls. Error: ${error}`);
            const errMessage = source === FILE_SOURCE_INPUT ? ERROR_IN_GETTING_S3_INPUT_SIGNED_URL
                : ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL;
            const httpStatus = error.getStatus();
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, errMessage, error, null, BATCH_API_DATA_FETCH_ERROR_CODE));
        }
    });

    batchRouter.get('/files/:source', async (req, res) => {
        const {source} = req.params;
        try {
            const responseData = await BatchService.getFiles(source);
            res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
        } catch (error) {
            logger.error(`Error occurred in getting the file list. Error: ${error}`);
            const errMessage = `${ERROR_IN_GETTING_S3_FILES} from bucket: ${source}`;
            const httpStatus = error.getStatus();
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, errMessage, error, null));
        }
    });

    batchRouter.get('/files/:source/:prefix', async (req, res) => {
        const {source} = req.params;
        const {prefix} = req.params;
        try {
            const responseData = await BatchService.getFilesByPrefix(source, prefix);
            res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
        } catch (error) {
            logger.error(`Error occurred in getting the file list by prefix. Error: ${error}`);
            const errMessage = `${ERROR_IN_GETTING_S3_FILES} from bucket: ${source}`;
            const httpStatus = error.getStatus();
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, errMessage, error, null));
        }
    });

    batchRouter.delete('/files/:source', async (req, res) => {
        const {source} = req.params;
        try {
            const responseData = await BatchService.deleteFiles(source, req.body);
            res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
        } catch (error) {
            logger.error(`Error occurred in getting the file list. Error: ${error}`);
            const errMessage = `${ERROR_IN_GETTING_S3_DELETING_FILES} from bucket: ${source}`;
            const httpStatus = error.getStatus();
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, errMessage, error, null));
        }
    });

    return batchRouter;
};
