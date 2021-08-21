import csv from 'csv-parser';
import { readStreamObject, deleteObject, copyObject, } from '../services/s3-client';

const readObject = (params) => new Promise((res, rej) => {
  readStreamObject(params)
    .pipe(csv())
    .on('data', chunk => {
      console.info('Read row of data', JSON.stringify(chunk, null, 2));
    })
    .on('end', () => res('Stream close'))
    .on('error', e => {
      console.info('Error occurred during object reading');
      rej(e);
    });
})

export const importFileParser = async (event) => {
  console.info('Event', JSON.stringify(event));

  try {
    const { bucket, object } = event.Records[0].s3;
    const params = {
      Bucket: bucket.name,
      Key: object.key
    };
    await readObject(params);

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