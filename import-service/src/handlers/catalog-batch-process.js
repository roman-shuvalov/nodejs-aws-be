import { createProductWithStocks } from '../repositories/product-repository';
import { publish } from '../services/sns-client';

export const catalogBatchProcess = async (event) => {
  console.info('Event', event);
  try {
    for await (const record of event.Records) {
      const product = JSON.parse(record.body);
      console.info('Product', JSON.stringify(product, null, 2));

      await createProductWithStocks(product);
      await publish(product, { price: { DataType: 'Number', StringValue: String(product.price) } });
    }
  } catch (e) {
    console.error('Error occurred during catalog batch processing', JSON.stringify(e, null, 2));
  }
}
