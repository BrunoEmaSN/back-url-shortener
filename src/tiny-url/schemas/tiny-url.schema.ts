import * as mongoose from 'mongoose';

export const TinyUrlSchema = new mongoose.Schema({
  shortUrl: String,
  originalUrl: String,
  userEmail: String
});