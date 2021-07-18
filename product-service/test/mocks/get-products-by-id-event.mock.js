export const getProductsByIdEventMock = (productId = '9190845d-3114-46c0-b7a7-e7ebf7a5530c') => {
  return {
    pathParameters: {
      productId,
    }
  };
}