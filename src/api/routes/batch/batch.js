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
    ERROR_IN_GETTING_S3_INPUT_SIGNED_URL,
    ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL,
    ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_INVALID_SOURCE,
    FILE_SOURCE_INPUT,
    FILE_SOURCE_OUTPUT,
} from '../../../util/constants';
import BatchService from '../../../service/batch/batchService';
import InvalidRequestException from '../../../exception/invalidRequestException';

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
                throw new InvalidRequestException(
                    ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_INVALID_SOURCE,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error) {
            logger.error(`Error occurred in getting signed urls. Error: ${error}`);
            const errMessage = source === FILE_SOURCE_INPUT ? ERROR_IN_GETTING_S3_INPUT_SIGNED_URL
                : ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL;
            const httpStatus = error.getStatus();
            res.status(httpStatus !== -1 ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, errMessage, error, null));
        }
    });

    return batchRouter;
};
