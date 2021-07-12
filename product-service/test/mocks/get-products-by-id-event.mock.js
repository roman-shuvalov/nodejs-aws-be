import products from '../../resources/product-list.json';

export const getProductsByIdEventMock = (productId = products[0].id) => {
  return {
    queryStringParameters: {
      productId,
    }
  };
}