import products from '../../resources/product-list.json';

export const findProducts = async () => {
  return products;
};

export const findProductById = async (productId) => {
  const products = await findProducts();
  return products.find(({ id }) => id === productId);
};
