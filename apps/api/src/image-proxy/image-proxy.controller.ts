// apps/backend/src/image-proxy/image-proxy.controller.ts
import {
  Controller,
  Get,
  Query,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

@Controller('proxy-image')
export class ImageProxyController {
  @Get()
  async getImage(@Query('url') url: string, @Res() res: Response) {
    try {
      const response = await axios.get(url, { responseType: 'stream' });

      res.setHeader('Content-Type', response.headers['content-type']);
      res.setHeader('Cache-Control', 'public, max-age=86400'); // optional
      response.data.pipe(res);
    } catch (err) {
      throw new HttpException('Image fetch failed', HttpStatus.BAD_REQUEST);
    }
  }
}
