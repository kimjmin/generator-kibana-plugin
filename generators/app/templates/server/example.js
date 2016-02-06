export default function (server) {

  server.route({
    path: '/api/<%= app_id %>/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

};
