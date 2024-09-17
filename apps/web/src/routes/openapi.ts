import {
    OpenAPIRegistry,
    OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi'
import * as yaml from 'yaml'
import * as fs from 'fs'

import * as Apiauthrefreshtoken from "../../src/app/api/auth/refresh_token/route.info";


const registry = new OpenAPIRegistry()

registry.registerPath({
  method: "post",
  path: "/api/auth/refresh_token",
  summary: "",
  request: {
  params: Apiauthrefreshtoken.Route.params,
  body: {
      required: true,
      content: {
        "application/json": {
          schema: Apiauthrefreshtoken.POST.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: Apiauthrefreshtoken.POST.result,
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions)
const docs = generator.generateDocument({
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'My API',
        description: 'This is the API',
    },
    servers: [{ url: 'v1' }],
})

fs.writeFileSync(`./openapi-docs.yml`, yaml.stringify(docs), {
    encoding: 'utf-8',
})
