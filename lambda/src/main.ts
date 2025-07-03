import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({ region: 'eu-central-1' });
const CLEAN_CHAT_MESSAGE_QUEUE_URL = process.env.CLEAN_CHAT_MESSAGE_QUEUE_URL;

interface Message {
    userId: string;
    room: string;
    content: string;
}

export const handler = async (event: any) => {
    try {
        for (const record of event.Records) {
            const message: Message = JSON.parse(record.body);
            console.log('Received raw message:', message);

            if (isMessageValid(message)) {
                const newMessage: Message = { userId: message.userId, room: message.room, content: message.content };
                await sqsClient.send(
                    new SendMessageCommand({
                        QueueUrl: CLEAN_CHAT_MESSAGE_QUEUE_URL,
                        MessageBody: JSON.stringify(newMessage),
                    }),
                );
            }
        }
    } catch (error) {
        console.error('Error processing SQS message:', error);
        throw error;
    }
};

function isMessageValid(message: Message) {
    if (message.content.toLowerCase() === 'very bad') {
        // process bad massages
        return false;
    }
    return true;
}
