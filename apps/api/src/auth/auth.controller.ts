import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from './config';

@Controller('api/auth')
export class AuthController {
  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    try {
      // Create a Request-like object for Better Auth
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      const webRequest = new Request(url, {
        method: req.method,
        headers: req.headers as HeadersInit,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      });
      
      const response = await auth.handler(webRequest);
      
      // Set response status and headers
      res.status(response.status);
      for (const [key, value] of response.headers.entries()) {
        res.setHeader(key, value);
      }
      
      const body = await response.text();
      res.send(body);
    } catch (error) {
      console.error('Auth handler error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}