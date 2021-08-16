jest.mock('../../src/services/s3-client');

import * as response from '../../src/services/response';
import * as s3 from '../../src/services/s3-client';
import { importProductsFile } from '../../src/handlers/import-products-file';

import { event } from '../mocks/created-file-event.mock';

beforeEach(() => {
  response.ok = jest.fn();
  response.badRequest = jest.fn();
  response.serverError = jest.fn();
  s3.getPutSignedUrlPromise = jest.fn();
  global.console = {
    info: jest.fn(),
    error: jest.fn(),
  };
});

afterEach(() => {
  response.ok.mockClear();
  response.badRequest.mockClear();
  response.serverError.mockClear();
  s3.getPutSignedUrlPromise.mockClear();
  global.console.info.mockClear();
  global.console.error.mockClear();
});

it('Should invoke bad request if name not provided', async () => {
  const eventMock = event();
  delete eventMock.queryStringParameters.name;

  await importProductsFile(eventMock);

  expect(response.badRequest).toHaveBeenCalled();
});

it('Should invoke getPutSignedUrlPromise with right params', async () => {
  const eventMock = event();
  const { name } = eventMock.queryStringParameters;
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${process.env.UPLOAD_FOLDER_NAME}/${name}`,
    ContentType: 'text/csv',
    Expires: 60,
  }

  await importProductsFile(eventMock);

  expect(s3.getPutSignedUrlPromise).toHaveBeenCalled();
  expect(s3.getPutSignedUrlPromise).toBeCalledWith(params);
});

it('Should invoke ok with right params', async () => {
  const eventMock = event();
  const signedUrl = 'asdadasda';
  s3.getPutSignedUrlPromise.mockResolvedValue(signedUrl);

  await importProductsFile(eventMock);

  expect(response.ok).toHaveBeenCalled();
  expect(response.ok).toBeCalledWith(signedUrl);
});

it('Should catch exceptions and invoke serverError if error occurred', async () => {
  const eventMock = event();
  s3.getPutSignedUrlPromise.mockRejectedValue();

  await importProductsFile(eventMock);

  expect(response.serverError).toHaveBeenCalled();
});