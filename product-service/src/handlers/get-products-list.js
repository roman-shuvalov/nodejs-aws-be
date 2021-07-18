import { findProducts } from '../repositories/product-repository';
import { ok, serverError } from '../services/response';

export const getProductsList = async () => {
  console.info('Invoke getProductsList function');

  try {
    const product = await findProducts();
    return ok(product);
  } catch (e) {
    console.error(e);
    return serverError();
  }
};
