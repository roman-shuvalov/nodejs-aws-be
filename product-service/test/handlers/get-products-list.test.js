import { getProductsList } from '../../src/handlers/get-products-list';

import * as productRepository from '../../src/repositories/product-repository';
import * as response from '../../src/services/response';

import products from '../../resources/product-list.json';

global.console = { log: jest.fn() };

beforeEach(() => {
  productRepository.findProducts = jest.fn();
  response.ok = jest.fn();
  response.serverError = jest.fn();
});

afterEach(() => {
  productRepository.findProducts.mockClear();
  response.ok.mockClear();
  response.serverError.mockClear();
});

it('Should invoke functions with right params', async () => {
  productRepository.findProducts.mockResolvedValue(products);

  await getProductsList();

  expect(productRepository.findProducts).toHaveBeenCalled();
  expect(response.ok).toHaveBeenCalled();
  expect(response.ok.mock.calls[0][0]).toStrictEqual(products);
});

it('Should catch server error', async () => {
  productRepository.findProducts.mockRejectedValue();

  await getProductsList();

  expect(global.console.log).toHaveBeenCalled();
  expect(response.serverError).toHaveBeenCalled();
});