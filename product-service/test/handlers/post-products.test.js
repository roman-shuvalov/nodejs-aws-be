import * as validator from '../../src/utils/product-schema-validator';
import * as productRepository from '../../src/repositories/product-repository';
import * as response from '../../src/services/response';
import { postProducts } from '../../src/handlers/post-products';

import { postProductsEventMock } from '../mocks/post-products-event.mock';
import { productMock } from '../mocks/product.mock';
import { responseMock } from '../mocks/response.mock';

const event = postProductsEventMock();
const product = productMock();

beforeEach(() => {
  validator.validate = jest.fn();
  productRepository.createProductWithStocks = jest.fn();
  response.ok = jest.fn();
  response.serverError = jest.fn();
  response.badRequest = jest.fn();
  global.console = {
    info: jest.fn(),
    error: jest.fn(),
  };
});

afterEach(() => {
  validator.validate.mockClear();
  productRepository.createProductWithStocks.mockClear();
  response.ok.mockClear();
  response.serverError.mockClear();
  response.badRequest.mockClear();
  global.console.info.mockClear();
  global.console.error.mockClear();
});

it('Should return badRequest if event body is not valid', async () => {
  const badRequestResponse = responseMock(400, JSON.stringify([{}]));
  response.badRequest.mockReturnValue(badRequestResponse);
  validator.validate.mockReturnValue(false);

  const res = await postProducts(event);

  expect(global.console.info).toHaveBeenCalled();
  expect(global.console.info.mock.calls[0][1]).toStrictEqual(event.body);
  expect(validator.validate).toHaveBeenCalled();
  expect(validator.validate.mock.calls[0][0]).toStrictEqual(JSON.parse(event.body));
  expect(response.badRequest).toHaveBeenCalled();
  expect(res).toStrictEqual(badRequestResponse);
});

it('Should catch server error', async () => {
  const serverErrorResponse = responseMock(500, 'Oops! Something went wrong');
  const err = 'err';
  response.serverError.mockReturnValue(serverErrorResponse);
  global.console.info = jest.fn(() => { throw err; });

  const res = await postProducts(event);

  expect(global.console.error).toHaveBeenCalled();
  expect(global.console.error.mock.calls[0][0]).toStrictEqual(err);
  expect(res).toStrictEqual(serverErrorResponse);
});

it('Should return created product', async () => {
  const serverOkResponse = responseMock(200, JSON.stringify(product));
  validator.validate.mockReturnValue(true);
  productRepository.createProductWithStocks.mockResolvedValue(product);
  response.ok.mockReturnValue(serverOkResponse);

  const res = await postProducts(event);

  expect(global.console.info).toHaveBeenCalled();
  expect(global.console.info.mock.calls[0][1]).toStrictEqual(event.body);
  expect(validator.validate).toHaveBeenCalled();
  expect(validator.validate.mock.calls[0][0]).toStrictEqual(JSON.parse(event.body));
  expect(productRepository.createProductWithStocks).toHaveBeenCalled();
  expect(productRepository.createProductWithStocks.mock.calls[0][0]).toStrictEqual(JSON.parse(event.body));
  expect(response.ok).toHaveBeenCalled();
  expect(response.ok.mock.calls[0][0]).toStrictEqual(product);
  expect(res).toStrictEqual(serverOkResponse);
});