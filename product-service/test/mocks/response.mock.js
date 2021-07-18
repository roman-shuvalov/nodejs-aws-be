export const responseMock = (statusCode, body) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode,
    body,
  }
}