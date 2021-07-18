import Ajv from 'ajv';

const schema = {
  type: 'object',
  properties: {
    count: { type: 'integer', minimum: 0 },
    price: { type: 'integer', minimum: 0 },
    title: { type: 'string' },
    description: { type: 'string' }
  },
  required: ['title'],
  additionalProperties: false,
};

const ajv = new Ajv();

export const validate = ajv.compile(schema);