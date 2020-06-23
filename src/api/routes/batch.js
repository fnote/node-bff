/**
 * Exposes batch related routes
 *
 * @author: gkar5861 on 19/06/20
 **/
import {Router} from 'express';
import * as HttpStatus from "http-status-codes";
import {createErrorResponse, createSuccessResponse} from "../../mapper/responseMapper";
import logger from '../../util/logger';
import {
    ERROR_IN_GETTING_S3_INPUT_SIGNED_URL,
    ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL,
    ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_INVALID_SOURCE,
    FILE_SOURCE_INPUT,
    FILE_SOURCE_OUTPUT,
} from "../../util/constants";
import batchService from "../../service/batchService";

export default () => {
    const batchRouter = new Router({mergeParams: true});

    batchRouter.post('/signed-url/:source', async (req, res) => {
        const source = req.params.source
        try {
            if (source === FILE_SOURCE_INPUT) {
                const responseData = await batchService.generateInputSignUrl(req.body);
                res.status(HttpStatus.OK).send(createSuccessResponse(responseData, null));
            } else if (source === FILE_SOURCE_OUTPUT) {
                const responseData = await batchService.generateOutputSignUrl(req.body);
                res.status(HttpStatus.OK).send(createSuccessResponse(responseData.data, null));
            } else {
                logger.error('Invalid source found while generating signed urls');
                res.status(HttpStatus.NOT_FOUND)
                    .send(createErrorResponse(null, ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_INVALID_SOURCE));
            }

        } catch (error) {
            logger.error(`Error occurred in getting signed urls. Error: ${error}`);
            const errMessage = source === FILE_SOURCE_INPUT ? ERROR_IN_GETTING_S3_INPUT_SIGNED_URL :
                ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL
            const httpStatus = error.getStatus();
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(error, errMessage));
        }
    });

    return batchRouter;

};