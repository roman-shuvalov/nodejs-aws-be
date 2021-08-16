const response = (data) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    ...data
  }
}

export const notFound = (body = 'Not found') => {
  return response({
    statusCode: 404,
    body,
  })
};

export const ok = (body) => {
  return response({
    statusCode: 200,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
};

export const serverError = () => {
  return response({
    statusCode: 500,
    body: 'Oops! Something went wrong'
  });
};

export const badRequest = (body) => {
  return response({
    statusCode: 400,
    body: JSON.stringify(body),
  });
}