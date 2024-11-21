import 'dotenv/config';
import fastify from 'fastify';
import { Server } from 'socket.io';
import Logger from './Logger';
import { ddb } from './DynamoDB';
import { MOTD, SERVER_HOST, SERVER_PORT } from './Config';
import { createAdapter } from "@socket.io/aws-sqs-adapter";
import { SNS } from "@aws-sdk/client-sns";
import { SQS } from "@aws-sdk/client-sqs";
import DIContainer from './DIContainer';
const snsClient = new SNS();
const sqsClient = new SQS({
    region: 'us-east-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});
const app = fastify();
const io = new Server(app.server, {
    adapter: createAdapter(snsClient, sqsClient)
});
await io.of('/').adapter.init();
DIContainer.initialize(ddb);
io.on('connection', socket => {
    socket.emit('serverMessage', MOTD);
});
app.listen({ port: SERVER_PORT, host: SERVER_HOST }, error => {
    if (error)
        throw error;
    Logger.log(`Server listening on ${SERVER_HOST}:${SERVER_PORT}`);
});
