import 'dotenv/config';
import * as Pusher from 'pusher';

export const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  useTLS: true,
  cluster: process.env.CLUSTER,
});
