import S3 from 'aws-sdk/clients/s3';

export const s3 = new S3();

export const readStreamObject = (params) =>
  s3.getObject(params)
    .createReadStream();

export const deleteObject = (params) =>
  s3.deleteObject(params).promise()
  .catch(e => {
    console.error('Error occurred during object deleting');
    throw e;
  });

export const copyObject = (params) =>
  s3.copyObject(params)
    .promise()
    .catch(e => {
      console.error('Error occurred during object coping');
      throw e;
    });

export const getPutSignedUrlPromise = (params) =>
  s3.getSignedUrlPromise('putObject', params)
    .catch(e => {
      console.error('Error occurred during getting signed url');
      throw e;
    });