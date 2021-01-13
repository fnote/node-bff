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
export const HTTP_DELETE = 'DELETE';

// HTTP req/res metadata
export const APPLICATION_JSON = 'application/json';
export const CORRELATION_ID_HEADER = 'X-Syy-Correlation-Id';

// http error codes
export const HTTP_CLIENT_ERROR_CODE_INTERNAL_SERVER_ERROR = 500;

// errors
export const ERROR_IN_GETTING_S3_INPUT_SIGNED_URL = 'Error in getting S3 input signed urls';
export const ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL = 'Error in getting S3 output signed urls';
export const INVALID_S3_BUCKET_SOURCE = `Invalid source is passed in the url. Valid sources are input/output`;
export const ERROR_IN_GETTING_S3_FILES = 'Error occurred while getting S3 files';
export const ERROR_IN_GETTING_S3_DELETING_FILES = 'Error occurred when deleting S3 files';
export const UNSUPPORTED_REQUEST_BODY = 'Unsupported request body';
export const INVALID_FILENAMES = 'Invalid/Unsupported Filenames format in the request';
export const INVALID_USERID = 'Invalid userId in the request';
export const ERROR_IN_FETCHING_CLOUD_PRICING_DATA = 'Failed to fetch data from Cloud Pricing Endpoint';

// whitelisted url paths
export const AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK = '/v1/pci-bff/support/healthcheck';

export const LOGIN_URL = '/v1/pci-bff/auth/login';
export const LOGOUT_URL = '/v1/pci-bff/auth/logout';

// user roles
export const ROLE_APP_ADMIN = 'appadmin';
export const ROLE_GENERAL_USER = 'generaluser';

export const MAX_ROLE_HIERARCHY_NUMBER = 10000;

// application constants
export const BETWEEN = 'Between';
export const CRITICAL = 'CRITICAL';
export const IS_APPLICABLE = 'isApplicable';

// file states
export const ERROR_FILE_EXTENSION = "_errors.txt"
export const ERROR_FILE = "_errors"
export const FILE_ERROR = 'error'
export const FILE_SUCCESS = 'success'

// Constant char
export const URL_SEPARATOR = '/';

// misc
export const ORDER_PRICE_TYPE_HAND = 'H';