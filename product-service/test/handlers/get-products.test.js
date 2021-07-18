import { getProductsById } from '../../src/handlers/get-products';
import * as productRepository from '../../src/repositories/product-repository';
import * as response from '../../src/services/response';

import { getProductsByIdEventMock } from '../mocks/get-products-by-id-event.mock';
import { productMock } from '../mocks/product.mock';
import { responseMock } from '../mocks/response.mock';

const product = productMock();
const event = getProductsByIdEventMock();

beforeEach(() => {
  productRepository.findProductById = jest.fn();
  response.ok = jest.fn();
  response.serverError = jest.fn();
  response.notFound = jest.fn();
  global.console = {
    info: jest.fn(),
    error: jest.fn(),
  };
});

afterEach(() => {
  productRepository.findProductById.mockClear();
  response.ok.mockClear();
  response.serverError.mockClear();
  response.notFound.mockClear();
  global.console.info.mockClear();
  global.console.error.mockClear();
});

it('Should catch server error', async () => {
  const err = 'err';
  const serverErrorResponse = responseMock(500, 'Oops! Something went wrong');
  response.serverError.mockReturnValue(serverErrorResponse);
  global.console.info = jest.fn(() => { throw err; });

  const res = await getProductsById(event);

  expect(global.console.error).toHaveBeenCalled();
  expect(global.console.error.mock.calls[0][0]).toStrictEqual(err);
  expect(response.serverError).toHaveBeenCalled();
  expect(res).toStrictEqual(serverErrorResponse)
});

it('Should invoke functions with right params', async () => {
  const serverOkResponse = responseMock(200, JSON.stringify(product));
  productRepository.findProductById.mockResolvedValue(product);
  response.ok.mockReturnValue(serverOkResponse);

  const res = await getProductsById(event);

  expect(global.console.info).toHaveBeenCalled();
  expect(productRepository.findProductById).toHaveBeenCalled();
  expect(productRepository.findProductById.mock.calls[0][0]).toStrictEqual(product.id);
  expect(response.ok).toHaveBeenCalled();
  expect(response.ok.mock.calls[0][0]).toStrictEqual(product);
  expect(res).toStrictEqual(serverOkResponse);
});

it('Should return not found', async () => {
  const serverNotFoundResponse = responseMock(404, 'Product not found');
  productRepository.findProductById.mockResolvedValue(undefined);
  response.notFound.mockReturnValue(serverNotFoundResponse);

  const res = await getProductsById(getProductsByIdEventMock());

  expect(global.console.info).toHaveBeenCalled();
  expect(response.notFound).toHaveBeenCalled();
  expect(response.notFound.mock.calls[0][0]).toStrictEqual('Product not found');
  expect(res).toStrictEqual(serverNotFoundResponse);
});