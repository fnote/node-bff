const GET = 'get';
const POST = 'post';
const version = '/v1';
const appName = '/pci-bff';

const routes = [
  { path: '/', method: GET },
  { path: '/support/healthcheck', method: GET},
  { path: '/batch/signed-url/{source}', method: POST },
  { path: '/auth/authenticate', method: GET },
  { path: '/auth/logout', method: GET },
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
