import { Document } from 'mongoose';

export interface TinyUrl extends Document {
  readonly shortUrl: string;
  readonly originalUrl: string;
  readonly userEmail: number;
}