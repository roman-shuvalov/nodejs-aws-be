import { catalogBatchProcess } from '../../src/handlers/catalog-batch-process';

import * as productRepository from '../../src/repositories/product-repository';
import * as sns from '../../src/services/sns-client';

import { event } from '../mocks/catalog-batch-process.mock';

const eventMock = event();
const productMock = JSON.parse(eventMock.Records[0].body);
const attributesMock = { price: { DataType: 'Number', StringValue: String(productMock.price) } };

beforeEach(() => {
  productRepository.createProductWithStocks = jest.fn();
  sns.publish = jest.fn();
  global.console = {
    info: jest.fn(),
    error: jest.fn(),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

it('Should invoke createProductWithStocks with right params', async () => {
  await catalogBatchProcess(eventMock);

  expect(productRepository.createProductWithStocks).toBeCalledWith(productMock);
});

it('Should invoke publish with right params', async () => {
  await catalogBatchProcess(eventMock);

  expect(sns.publish).toBeCalledWith(productMock, attributesMock);
});

it('Should catch errors', async () => {
  productRepository.createProductWithStocks.mockImplementation(() => {
    throw new Error();
  });

  await catalogBatchProcess(eventMock);

  expect(console.error).toHaveBeenCalled();
});
