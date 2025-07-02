import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({ region: 'eu-central-1' });
const CLEAN_CHAT_MESSAGE_QUEUE_URL = process.env.CLEAN_CHAT_MESSAGE_QUEUE_URL;

export const handler = async (event: any) => {
    try {
        for (const record of event.Records) {
            const message = JSON.parse(record.body);
            console.log('Received raw message:', message);

            if (message.content === 'very bad') {
                // skip this message or push to queue with bad messages
                break;
            }

            const newMessage = { userId: message.userId, room: message.room, content: message.content };
            const sanitazedMessage = JSON.stringify(newMessage);

            await sqsClient.send(
                new SendMessageCommand({
                    QueueUrl: CLEAN_CHAT_MESSAGE_QUEUE_URL,
                    MessageBody: sanitazedMessage,
                }),
            );
            console.log('New message sent successfully');
        }
    } catch (error) {
        console.error('Error processing SQS message:', error);
        throw error;
    }
};
