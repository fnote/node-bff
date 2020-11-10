import correlator from 'express-correlation-id';

/**
 * Returns the correlation id
 * The correlation id will be consistent across async calls within the handling of a request.
 */
export const getCorrelationId = () => correlator.getId();

/**
 * Returns an express middleware that creates a correlation scope for all following middleware and route handlers
 * @param {Object} options - header details
 */
export const correlatorMiddleware = (options) => correlator(options);
