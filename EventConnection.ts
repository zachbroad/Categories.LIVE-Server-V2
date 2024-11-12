import { Socket } from 'socket.io';
import { logger } from './logger';

export function EventConnection(socket: Socket) {
	logger.log('a user connected');
}
