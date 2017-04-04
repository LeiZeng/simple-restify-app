import config from 'config'
import swagger from 'swagger-restify'

export default (app) => {
  swagger.init(app, {
      swagger: '2.0', // or swaggerVersion as backward compatible
      info: {
        version: '1.0',
        title: 'Swagger 2.0 Restify example'
      },
      tags: [{
        name: 'example',
        description: 'Just an example API'
      }],
      host: 'localhost:' + config.get('port'),
      apis: ['./src/apis/user.yml'],
      produces: [
        'application/json',
        'text/xml'
      ],
      consumes: [
        'application/json',
        'text/xml'
      ],
      // swagger-restify proprietary
      swaggerURL: '/swagger',
      swaggerJSON: '/api-docs.json',
      swaggerUI: './node_modules/swagger-restify/examples/example_v2.0/public'
  })
}
