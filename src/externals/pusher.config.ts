import * as Pusher from 'pusher';

export const pusher = new Pusher({
  appId: '1735442',
  key: 'ef555a846b0486d49906',
  secret: 'fffcb75f4687bd334d9e',
  useTLS: true,
  cluster: 'us2',
});
