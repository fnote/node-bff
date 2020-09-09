import {
    ROLE_APP_ADMIN,
    ROLE_CFO,
    ROLE_DDS_ADMIN,
    ROLE_DRM,
    ROLE_DSM,
    ROLE_GENERAL_USER,
    ROLE_RSM,
    ROLE_VP_MERCHANDISING,
    ROLE_VP_SALES
} from "../util/constants";

export default function getBatchAPIConfigs() {
    return {
        api: {
            getInputSignedUrl: `${process.env.BATCH_API}/v1/batch/files/signed-url/input`,
            getOutputSignedUrl: `${process.env.BATCH_API}/v1/batch/files/signed-url/output`,
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
        logoutRedirectionUrl: `https://${process.env.COGNITO_AUTH_URL}/logout?client_id=${process.env.COGNITO_APP_CLIENT_ID}&logout_uri=https://google.com`,

    },
});

export const getCloudPricingConfig = () => ({
    CONFIG: {
        cloudPricingUrl: `${process.env.CLOUD_PRICING_URL}/v1/pricing/pricemanager`,
        clientId: 'Cloud-PCI',
        priceEngineType: 'CP',
    },
});

export const getProductInfoApiConfig = () => ({
    CONFIG: {
        productInfoApiUrl: `${process.env.API_CENTRAL_BASE_URL}/sm/product-info/1.0.0`,
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

export const getAuthorizationRoleHierarchy = () => {
    const authorizationRoleHierarchy = {}

    authorizationRoleHierarchy[ROLE_APP_ADMIN] = 1;
    authorizationRoleHierarchy[ROLE_GENERAL_USER] = 2;
    authorizationRoleHierarchy[ROLE_DDS_ADMIN] = 3;
    authorizationRoleHierarchy[ROLE_VP_MERCHANDISING] = 4;
    authorizationRoleHierarchy[ROLE_CFO] = 5;
    authorizationRoleHierarchy[ROLE_VP_SALES] = 6;
    authorizationRoleHierarchy[ROLE_DRM] = 7;
    authorizationRoleHierarchy[ROLE_RSM] = 8;
    authorizationRoleHierarchy[ROLE_DSM] = 9;

    return authorizationRoleHierarchy;
};
