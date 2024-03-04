import { BASE_URL_SERVER } from '@config/baseURL'
import {
  APP_NAME,
  NODE_ENV,
  APP_URL,
} from '@config/env'
import _ from 'lodash'
import swaggerJSDoc from 'swagger-jsdoc'
import paths from './paths'
import tags from './tags'

let baseURLServer = []
let swaggerOptURL = []

if (NODE_ENV === 'development') {
  baseURLServer = [
    {
      url: `${BASE_URL_SERVER}`,
      description: `${_.capitalize(NODE_ENV)} Server`,
    },
    {
      url: `${APP_URL}`,
      description: 'URL',
    },
  ]

  swaggerOptURL = [
    {
      url: `${BASE_URL_SERVER}/api-docs.json`,
      name: `${_.capitalize(NODE_ENV)} Server`,
    },
    {
      url: `${APP_URL}/api-docs.json`,
      name: 'URL',
    },
  ]
} else {
  baseURLServer = [
    {
      url: `${BASE_URL_SERVER}`,
      description: `${_.capitalize(NODE_ENV)} Server`,
    },
  ]

  swaggerOptURL = [
    {
      url: `${BASE_URL_SERVER}/api-docs.json`,
      name: `${_.capitalize(NODE_ENV)} Server`,
    },
  ]
}

export const swaggerOptions = {
  definition: {
    info: {
      title: `Api ${APP_NAME} Docs`,
      description: `This is Api Documentation ${APP_NAME}`,
      version: '1.0.0',
    },
    openapi: '3.0.1',
    servers: baseURLServer,
    // Set GLOBAL
    // security: [
    //   {
    //     auth_token: []
    //   }
    // ],
    components: {
      securitySchemes: {
        auth_token: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description:
            'JWT Authorization header using the JWT scheme. Example: “Authorization: JWT {token}”',
        },
        basic_auth: {
          type: 'http',
          scheme: 'basic',
        },
      },
      // schemas: docsSchemes,
      parameters: {
        page: {
          in: 'query',
          name: 'page',
          required: false,
          default: 1,
        },
        pageSize: {
          in: 'query',
          name: 'pageSize',
          required: false,
          default: 10,
        },
        filtered: {
          in: 'query',
          name: 'filtered',
          required: false,
          default: [],
          description: 'Example: [{"id": "email", "value": "anyValue"}]',
        },
        sorted: {
          in: 'query',
          name: 'sorted',
          required: false,
          default: [],
          description: 'Example: [{"id": "createdAt", "desc": true}]',
        },
        lang: {
          in: 'query',
          name: 'lang',
          schema: { type: 'string', enum: ['en', 'id'] },
          required: false,
        },
      },
    },
    // paths: docsSources,
    paths,
    tags,
  },
  apis: [],
}

export const swaggerSpec = swaggerJSDoc(swaggerOptions)
export const optionsSwaggerUI = {
  explorer: true,
  swaggerOptions: { urls: swaggerOptURL },
}
