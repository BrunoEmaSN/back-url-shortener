import { Connection } from 'mongoose';
import { TinyUrlSchema } from '../schemas/tiny-url.schema';

export const tinyUrlProviders = [
  {
    provide: 'TINY_URL_MODEL',
    useFactory: (connection: Connection) => connection.model('TinyUrl', TinyUrlSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];