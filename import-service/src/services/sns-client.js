import { SNS } from 'aws-sdk';

const sns = new SNS({ apiVersion: '2010-03-31' });

export const publish = (message, attributes) => {
  const params = {
    Message: JSON.stringify(message),
    MessageAttributes: attributes,
    TargetArn: process.env.CREATE_PRODUCT_TOPIC,
  }

  return sns.publish(params).promise();
}
