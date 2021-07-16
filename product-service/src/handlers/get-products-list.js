import { findProducts } from '../repositories/product-repository';
import { ok, serverError } from '../services/response';

export const getProductsList = async () => {
  try {
    const product = await findProducts();
    return ok(product);
  } catch (e) {
    console.log(e);
    return serverError();
  }
};
