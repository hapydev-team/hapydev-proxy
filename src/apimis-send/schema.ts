export const REQUEST_SCHEMA = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  properties: {
    url: {
      type: 'string',
    },
    method: {
      type: 'string',
    },
    auth: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
        },
      },
      required: ['type'],
    },
    headers: {
      type: 'object',
      properties: {
        parameter: {
          type: 'array',
        },
      },
      required: ['parameter'],
    },
    params: {
      type: 'object',
      properties: {
        parameter: {
          type: 'array',
        },
      },
      required: ['parameter'],
    },
    body: {
      type: 'object',
      properties: {
        mode: {
          type: 'string',
        },
        parameter: {
          type: 'array',
        },
        raw: {
          type: 'string',
        },
      },
      required: ['mode', 'parameter', 'raw'],
    },
    cookies: {
      type: 'array',
    },
  },
  required: ['url', 'auth', 'headers', 'params', 'body'],
};

export default REQUEST_SCHEMA;
