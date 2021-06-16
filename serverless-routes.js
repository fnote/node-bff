const GET = 'get';
const POST = 'post';
const DELETE = 'delete';
const version = '/v1';
const appName = '/pci-bff';

const routes = [
  { path: '/', method: GET },
  { path: '/support/healthcheck', method: GET},
  { path: '/support/status', method: GET},
  { path: '/batch/files/signed-url/input', method: POST },
  { path: '/batch/files/signed-url/output', method: POST },
  { path: '/batch/jobs', method: GET },
  { path: '/batch/jobs/{jobId}', method: DELETE },
  { path: '/auth/login', method: GET },
  { path: '/auth/logout', method: GET },
  { path: '/auth/user-details', method: GET },
  { path: '/pricing/pricing-data', method: POST },
  { path: '/price-zone-reassignment/item-attribute-groups', method: GET},
  { path: '/price-zone-reassignment/pz-update-requests', method: GET}
];

module.exports = () => {
  const output = [];
  let route = null;
  routes.forEach((r) => {
    route = {
      http: { path: version + appName + r.path, method: r.method, cors: true },
    };
    output.push(route);
  });
  return output;
};
