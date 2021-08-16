import { validate } from '../utils/product-schema-validator';
import { createProductWithStocks } from '../repositories/product-repository';
import { badRequest, serverError, ok } from '../services/response';

export const postProducts = async (event) => {
  try {
    console.info('Invoke postProducts function with body\n', event.body);

    const data = JSON.parse(event.body);
    const isValid = validate(data);
    if (!isValid) {
      return badRequest(validate.errors);
    }

    const product = await createProductWithStocks(data);
    return ok(product);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}