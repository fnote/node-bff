/**
 * Ssm Service mock
 *
 * @author: cwick0864 on 10/08/20
 * */

export const getSsmConfig = (key) => {
    if (key === 'ApiCentralAuthorizationToken') {
        return 'mock api key';
    }
};
