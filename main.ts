import 'dotenv/config';
import fastify from 'fastify';
import { Server } from 'socket.io';
import { logger } from './logger';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = fastify();
const io = new Server(app.server);

io.on('connection', socket => {});

app.listen({ port: PORT, host: HOST }, error => {
	if (error) throw error;
	logger.log(`Server listening on ${HOST}:${PORT}`);
});
