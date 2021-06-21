import {ROLE_APP_ADMIN, ROLE_GENERAL_USER} from '../util/constants';

export default function getBatchAPIConfigs() {
    return {
        api: {
            getInputSignedUrl: `${process.env.BATCH_API}/v1/batch/files/signed-url/input`,
            getOutputSignedUrl: `${process.env.BATCH_API}/v1/batch/files/signed-url/output`,
            batchBaseUrl: `${process.env.BATCH_API}/v1/batch/users/`,
            jobRoute: '/jobs',
            jobRouteWithPathDelimiter: '/jobs/',
        },
    };
}

export const getAuthConfig = () => ({
    CONFIG: {
        jwkRequestUrl: `https://cognito-idp.us-east-1.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
        authTokenIssuer: `https://cognito-idp.us-east-1.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
        authTokenHeaderAttribute: 'x-amzn-oidc-accesstoken',
        userClaimHeaderAttribute: 'x-amzn-oidc-data',
        authCookieName1: 'PCI-ELBAuthSessionCookie-0',
        authCookieName2: 'PCI-ELBAuthSessionCookie-1',
        loginRedirectionUrl: `${process.env.FRONTEND_URL}`,
        logoutRedirectionUrl: `https://${process.env.COGNITO_AUTH_URL}/logout?client_id=${process.env.COGNITO_APP_CLIENT_ID}&logout_uri=${process.env.FRONTEND_URL}`,

    },
});

export const getCloudPricingConfig = () => ({
    CONFIG: {
        cloudPricingBaseUrl: `${process.env.CLOUD_PRICING_URL}/v1/pricing/`,
        clientId: 'Cloud-PCI',
        priceEngineType: 'CP',
        pciPricesEndpoint: 'pci-prices',
        productPricesEndpoint: 'product-prices',
    },
});

export const getProductInfoApiConfig = () => ({
    CONFIG: {
        productInfoApiUrl: `${process.env.API_CENTRAL_BASE_URL}/services/enterprise-product-information-service-v1`,
    },
});

export const getCustomerInfoApiConfig = () => ({
    CONFIG: {
        customerInfoApiUrl: `${process.env.API_CENTRAL_BASE_URL}/services/enterprise-customer-service-v1`,
    },
});

export const getApiCentralConfig = () => ({
    CONFIG: {
        apiCentralBaseUrl: process.env.API_CENTRAL_BASE_URL,
    },
});

export const getSSMlConfig = () => ({
    CONFIG: {
        APICentralAuthorizationToken: process.env.API_CENTRAL_BASE_URL,
    },
});

export const getSeedApiConfig = () => ({
    CONFIG: {
        seedApiBaseUrl: `${process.env.API_CENTRAL_BASE_URL}/v1/edwp`,
        clientId: 'Cloud_PCI',
        getItemAttributeGroupsEndpoint: '/attribute-groups',
        getCustomerAndItemAttributeGroupsEndpoint: '/customer-item-attribute-pricezone',
        getCustomerGroupAndItemAttributeGroupsEndpoint: '/customer-group-item-attribute-group-pricezone',
    },
});

export const getCIPZApiConfig = () => ({
    CONFIG: {
        cipzApiBaseUrl: `${process.env.API_CENTRAL_BASE_URL}/v1/cipz`,
        clientId: 'Cloud_PCI',
        getSubmittedRequestEndpoint: '/pz-update-requests',
        getPriceZoneUpdateEndpoint: '/price-zone-updates/',
        createPriceZoneUpdateEndpoint: '/pz-update-requests',
        patchApproveRejectApprovalReqEndpoint: '/pz-update-requests',
    },
});

export const getAuthorizationRoleHierarchy = () => {
    const authorizationRoleHierarchy = {};

    authorizationRoleHierarchy[ROLE_APP_ADMIN] = 1;
    authorizationRoleHierarchy[ROLE_GENERAL_USER] = 2;

    return authorizationRoleHierarchy;
};

export const getPriceSourceName = (key) => {
    const priceSourceNameMap = {
        30: 'Price Rule',
        40: 'Co Default',
        45: 'PR Default',
        50: 'Min Rule',
        52: 'Hand Price',
        61: 'GTD Price',
        70: 'Substitution',
        96: 'Exception',
        97: 'Price Advisor',
    };
    return priceSourceNameMap[key];
};
