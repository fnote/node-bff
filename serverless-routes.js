const GET = 'get';
const version = '/v1';

const routes = [
  { path: '/', method: 'get' },
];

module.exports = () => {
  const output = [];
  let route = null;
  routes.forEach((r) => {
    route = {
      http: { path: version + r.path, method: r.method, cors: true },
    };
    output.push(route);
  });
  return output;
};
