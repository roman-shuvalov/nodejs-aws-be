import { getProductsById } from '../../src/handlers/get-products';
import * as productRepository from '../../src/repositories/product-repository';
import * as response from '../../src/services/response';

import products from '../../resources/product-list.json';
import { getProductsByIdEventMock } from '../mocks/get-products-by-id-event.mock';

global.console = { log: jest.fn() };

beforeEach(() => {
  productRepository.findProductById = jest.fn();
  response.ok = jest.fn();
  response.serverError = jest.fn();
  response.notFound = jest.fn();
});

afterEach(() => {
  productRepository.findProductById.mockClear();
  response.ok.mockClear();
  response.serverError.mockClear();
  response.notFound.mockClear();
});

it('Should catch server error', async () => {
  await getProductsById({});

  expect(global.console.log).toHaveBeenCalled();
  expect(response.serverError).toHaveBeenCalled();
});

it('Should invoke functions with right params', async () => {
  const product = products[0];
  productRepository.findProductById.mockResolvedValue(product);

  await getProductsById(getProductsByIdEventMock());

  expect(productRepository.findProductById).toHaveBeenCalled();
  expect(productRepository.findProductById.mock.calls[0][0]).toStrictEqual(product.id);
  expect(response.ok).toHaveBeenCalled();
  expect(response.ok.mock.calls[0][0]).toStrictEqual(product);
});

it('Should return not found', async () => {
  productRepository.findProductById.mockResolvedValue(undefined);

  await getProductsById(getProductsByIdEventMock());

  expect(response.notFound).toHaveBeenCalled();
  expect(response.notFound.mock.calls[0][0]).toStrictEqual('Product not found');
});