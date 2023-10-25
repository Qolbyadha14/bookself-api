const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const config = {
  port: 9000,
  host: 'localhost',
};

const init = async (c) => {
  const server = Hapi.server({
    port: c.port,
    host: c.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  // Development
  // console.log(`Server running ${server.info.uri}`);

  return server;
};

init(config);
