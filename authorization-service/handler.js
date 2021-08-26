console.log('process.env.authConfig', process.env.authConfig);
const authConfig = process.env.authConfig ? JSON.parse(process.env.authConfig) : {};
const credentials = `${authConfig.user}:${authConfig.password}`;

const generatePolicy = function(principalId, effect, resource) {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = '*'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
}

const generateAllow = function(principalId, resource) {
  return generatePolicy(principalId, 'Allow', resource);
}

const generateDeny = function(principalId, resource) {
  return generatePolicy(principalId, 'Deny', resource);
}

module.exports.basicAuthorizer = (event, context, callback) => {
  console.log(event)
  const basicToken = String(event.authorizationToken).split(' ')[1];
  if (!basicToken) {
    return callback('Unauthorized');
  }

  const userPassword = Buffer.from(basicToken, 'base64').toString('ascii');
  if (userPassword !== credentials) {
    return callback(null, generateDeny('me', event.methodArn))
  }

  callback(null, generateAllow('me', event.methodArn));
};
