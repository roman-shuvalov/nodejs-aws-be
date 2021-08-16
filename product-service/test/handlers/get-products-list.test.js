import { getProductsList } from '../../src/handlers/get-products-list';
import * as productRepository from '../../src/repositories/product-repository';
import * as response from '../../src/services/response';

import { productMock } from '../mocks/product.mock';
import { responseMock } from '../mocks/response.mock';

const products = [
  productMock(),
  productMock(),
  productMock(),
]

beforeEach(() => {
  productRepository.findProducts = jest.fn();
  response.ok = jest.fn();
  response.serverError = jest.fn();
  global.console = {
    info: jest.fn(),
    error: jest.fn(),
  };
});

afterEach(() => {
  productRepository.findProducts.mockClear();
  response.ok.mockClear();
  response.serverError.mockClear();
  global.console.info.mockClear()
  global.console.error.mockClear();
});

it('Should invoke functions with right params', async () => {
  const serverOkResponse = responseMock(200, JSON.stringify(products));
  productRepository.findProducts.mockResolvedValue(products);
  response.ok.mockReturnValue(serverOkResponse);

  const res = await getProductsList();

  expect(global.console.info).toHaveBeenCalled();
  expect(productRepository.findProducts).toHaveBeenCalled();
  expect(response.ok).toHaveBeenCalled();
  expect(response.ok.mock.calls[0][0]).toStrictEqual(products);
  expect(res).toStrictEqual(serverOkResponse);
});

it('Should catch server error', async () => {
  const serverErrorResponse = responseMock(500, 'Oops! Something went wrong');
  productRepository.findProducts.mockRejectedValue();
  response.serverError.mockReturnValue(serverErrorResponse);

  const res = await getProductsList();

  expect(global.console.info).toHaveBeenCalled();
  expect(global.console.error).toHaveBeenCalled();
  expect(response.serverError).toHaveBeenCalled();
  expect(res).toStrictEqual(serverErrorResponse);
});