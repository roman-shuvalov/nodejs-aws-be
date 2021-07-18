export const postProductsEventMock = () => {
  return {
    body: JSON.stringify({
      title: 'Created through API',
      count: 19,
      price: 4,
      description: 'Supercool product',
    })
  }
}