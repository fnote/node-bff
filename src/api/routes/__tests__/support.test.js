/**
 * Support routes unit tests
 *
 * @author: gkar5861 on 22/06/20
 * */
import request from 'supertest';
import * as HttpStatus from 'http-status-codes';
import {app} from '../../../app';
import {CLOUD_PCI_BFF, CLOUD_PCI_BFF_VERSION} from '../../../util/constants';
import {jest} from "@jest/globals";

jest.mock('../../../initializer', () => ({
    initializer: (req, res, next) => next(),
}));

describe('routes: /support', () => {
    test('get /support/healthcheck should return project details when the app is up and running', async () => {
        const response = await request(app)
            .get('/v1/pci-bff/support/healthcheck')
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.appVersion).toEqual(CLOUD_PCI_BFF_VERSION);
        expect(response.body.appName).toEqual(CLOUD_PCI_BFF);
    });
});
