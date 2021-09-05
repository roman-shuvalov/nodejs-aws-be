import csv from 'csv-parser';
import { pushMessage } from '../services/sqs-client';
import { readStreamObject, deleteObject, copyObject, } from '../services/s3-client';
import { validate } from '../utils/product-schema-validator';

const readObject = (params, onChunk) => new Promise((res, rej) => {
  readStreamObject(params)
    .pipe(csv())
    .on('data', async chunk => {
      console.info('Read row of data', JSON.stringify(chunk, null, 2));
      if (onChunk) {
        await Promise.resolve(chunk).then(onChunk);
      }
    })
    .on('end', () => res('Stream close'))
    .on('error', e => {
      console.info('Error occurred during object reading');
      rej(e);
    });
});

const processProduct = async (chunk) => {
  try {
    const product = {
      ...chunk,
      price: Number(chunk.price),
      count: Number(chunk.count),
    }
    if (!validate(product)) {
      return console.log(`Product schema is not valid`, JSON.stringify(validate.errors));
    }
    await pushMessage(process.env.CATALOG_ITEMS_QUEUE, product);
  } catch (e) {
    console.error('Error occurred during processing product', e);
  }
};

export const importFileParser = async (event) => {
  console.info('Event', JSON.stringify(event));

  try {
    const { bucket, object } = event.Records[0].s3;
    const params = {
      Bucket: bucket.name,
      Key: object.key
    };
    await readObject(params, processProduct);

    const copyParams = {
      CopySource: `${params.Bucket}/${params.Key}`,
      Bucket: process.env.BUCKET_NAME,
      Key: `${process.env.PARSED_FOLDER_NAME}/${params.Key.split('/')[1]}`,
    };
    await copyObject(copyParams);

    await deleteObject(params);
  } catch (e) {
    console.error('Error occurred during processing', e.message);
  }
}
