import { findProductById } from '../repositories/product-repository';
import { ok, notFound, serverError } from '../services/response';

export const getProductsById = async (event) => {
  try {
    const { pathParameters: { productId } } = event;
    console.info(`Invoke getProductsById function with productId: ${productId}`);

    const product = await findProductById(productId);

    if (!product) {
      return notFound('Product not found');
    }

    return ok(product);
  } catch (e) {
    console.error(e);
    return serverError();
  }
};
