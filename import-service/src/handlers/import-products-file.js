import { getPutSignedUrlPromise } from '../services/s3-client';
import { ok, badRequest, serverError } from '../services/response';

export const importProductsFile = async (event) => {
  console.info('Import file event', JSON.stringify(event, null, 2));

  const { queryStringParameters } = event;
  if (!queryStringParameters || !queryStringParameters.name) {
    return badRequest(`Querystring parameter 'name' is required!`);
  }

  const { name } = queryStringParameters;
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${process.env.UPLOAD_FOLDER_NAME}/${name}`,
    ContentType: 'text/csv',
    Expires: 60,
  }

  try {
    const signedUrl = await getPutSignedUrlPromise(params);
    return ok(signedUrl);
  } catch (e) {
    console.error('Error occurred during importing file', JSON.stringify(e, null, 2));
    return serverError();
  }
}