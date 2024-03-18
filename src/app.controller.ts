import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Redirect, Res } from '@nestjs/common';
import { TinyUrlsService } from './tiny-url/tiny-url.service';
import { CreateTinyUrlDto } from './tiny-url/dtos/create-tiny-url.dto';
import { TinyUrl } from './tiny-url/interfaces/tiny-url.interface';
import { FindTinyUrlsDto } from './tiny-url/dtos/find-tiny-urls.dto';

@Controller()
export class AppController {
  constructor(private readonly tinyUrlsService: TinyUrlsService) {}

  @Post()
  async findAllByEmail(@Body() findTinyUrlsDto: FindTinyUrlsDto): Promise<TinyUrl[]> {
    try {
      return this.tinyUrlsService.findAllByEmail(findTinyUrlsDto.email);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'No short url was found associated with the email',
      }, HttpStatus.NOT_FOUND, {
        cause: error
      });
    }
  }

  @Post('/create')
  async create(@Body() createTinyUrlDto: CreateTinyUrlDto) {
    try {
      const result = await this.tinyUrlsService.create(createTinyUrlDto);
      const shortUrl = `${process.env.DOMAIN}/${result.shortUrl}`;
  
      return shortUrl;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Could not create a new account',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

  @Get('/:shortUrl')
  async findByShortUrl(@Param('shortUrl') shortUrl: string, @Res() res) {
    try {
      const originalUrl = await this.tinyUrlsService.findOriginalUrlByShortUrl(shortUrl);
  
      return res.redirect(originalUrl)
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Short url not found',
      }, HttpStatus.NOT_FOUND, {
        cause: error
      });
    }
  }
}
