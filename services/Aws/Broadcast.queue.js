import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
const config = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.awsId,
    secretAccessKey: process.env.awsKey,
  },
};

const sqsclient = new SQSClient(config);
const queueUrl = "https://sqs.us-east-1.amazonaws.com/885066190508/Broadcast";

const sqsServices = {};

sqsServices.sendmessage = async (body) => {
  try {
    const command = new SendMessageCommand({
      MessageBody: body,
      QueueUrl: queueUrl,
      MessageAttributes: {
        orderId: { DataType: "String", StringValue: "4421x" },
      },
    });

    const result = await sqsclient?.send(command);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

sqsServices.pullmessagefromqueues = async () => {
  try {
    const command = new ReceiveMessageCommand({
      MaxNumberOfMessages: 10,
      QueueUrl: queueUrl,
      WaitTimeSeconds: 5,
      MessageAttributeNames: ["All"],
    });
    const result = await sqsclient?.send(command);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

sqsServices.deletemessagefromqueue = async (id) => {
  try {
    const command = new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: id,
    });
    const result = await sqsclient?.send(command);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

export default sqsServices;
