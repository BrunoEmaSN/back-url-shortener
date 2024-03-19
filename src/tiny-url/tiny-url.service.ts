import { Model } from 'mongoose';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { TinyUrl } from './interfaces/tiny-url.interface';
import { CreateTinyUrlDto } from './dtos/create-tiny-url.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TinyUrlsService {
  private NUM_CHARS_SHORT_LINK = 7;
  private ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  constructor(
    @Inject('TINY_URL_MODEL')
    private tinyUrlModel: Model<TinyUrl>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(CreateTinyUrlDto: CreateTinyUrlDto): Promise<TinyUrl> {
    const shortUrl = await this.generateRandomShortUrl();
    const createdTinyUrl = new this.tinyUrlModel({
      ...CreateTinyUrlDto,
      shortUrl
    });

    return createdTinyUrl.save();
  }

  async generateRandomShortUrl(): Promise<string> {
    let result = "";
    while (true) {
      for (let i = 0; i < this.NUM_CHARS_SHORT_LINK; i++) {
        let randomIndex = Math.floor(Math.random() * (this.ALPHABET.length - 1))
        result += this.ALPHABET[randomIndex];
      }

      // make sure the short link isn't already used
      const exist = await this.checkShortUrlExists(result);
      if (!exist) {
        return result;;
      }
    }
  }

  async checkShortUrlExists(shortUrl: string): Promise<boolean> {
    const shortUrls = await this.tinyUrlModel.find({ "shortUrl": shortUrl }).exec();
    return shortUrls.length ? true : false
  }

  async findAllByEmail(email: string): Promise<TinyUrl[]> {
    return this.tinyUrlModel.find({ "userEmail": email }).exec();
  }

  async findOriginalUrlByShortUrl(shortUrl: string): Promise<string> {
    const key = 'short-urls';
    const shortUrlsCached: TinyUrl[] = await this.cacheManager.get(key) || [];
    const shortUrlCached = shortUrlsCached.find(tinyUrl => tinyUrl.shortUrl === shortUrl);

    if(shortUrlCached) {
      return shortUrlCached.originalUrl;
    }
    
    const shortUrls = await this.tinyUrlModel.findOne({ "shortUrl": shortUrl }).exec();
    this.cacheManager.set(key, [...shortUrlsCached, shortUrls], 1000 * 10); 
    return shortUrls.originalUrl;
  }
}