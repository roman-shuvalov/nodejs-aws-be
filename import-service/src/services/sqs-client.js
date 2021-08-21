import { SQS } from 'aws-sdk'

const sqs = new SQS({ apiVersion: '2012-11-05' });

export const pushMessage = (queueUrl, message) => {
  const params = {
    MessageBody: JSON.stringify(message),
    QueueUrl: queueUrl
  };

  return sqs.sendMessage(params).promise();
}
