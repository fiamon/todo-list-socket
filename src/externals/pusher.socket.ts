import { pusher } from './pusher.config';

export function socketEvent(channelName: string, eventName: string, data: any) {
  pusher.trigger(channelName, eventName, data);
}
