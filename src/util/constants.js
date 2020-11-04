/**
 * Application constants
 *
 * */

export const CLOUD_PCI_BFF = 'Cloud PCI BFF';
export const CLOUD_PCI_BFF_VERSION = '1.0.0';
export const SUCCESS = 'success';
export const ERROR = 'error';

// AWS values
export const AWS_REGION = 'us-east-1';

// file sources
export const FILE_SOURCE_INPUT = 'input';
export const FILE_SOURCE_OUTPUT = 'output';

// http methods
export const HTTP_GET = 'GET';
export const HTTP_POST = 'POST';

// HTTP req metadata
export const APPLICATION_JSON = 'application/json';

// http error codes
export const HTTP_CLIENT_ERROR_CODE_INTERNAL_SERVER_ERROR = 500;

// errors
export const ERROR_IN_GETTING_S3_INPUT_SIGNED_URL = 'Error in getting S3 input signed urls';
export const ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL = 'Error in getting S3 output signed urls';
export const ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_INVALID_SOURCE = `Invalid source is passed in the url. 
Valid sources are input/output`;
export const ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY = 'Unsupported request body';
export const ERROR_IN_FETCHING_CLOUD_PRICING_DATA = 'Failed to fetch data from Cloud Pricing Endpoint';

// whitelisted url paths
export const AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK = '/v1/pci-bff/support/healthcheck';

export const LOGIN_URL = '/v1/pci-bff/auth/login';
export const LOGOUT_URL = '/v1/pci-bff/auth/logout';

// user roles
export const ROLE_APP_ADMIN = 'appadmin';
export const ROLE_GENERAL_USER = 'generaluser';

export const MAX_ROLE_HIERARCHY_NUMBER = 10000;
