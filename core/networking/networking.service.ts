import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NetworkingService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  send<TResponse>(pattern: object, data: unknown) {
    return this.authClient.send<TResponse>(pattern, data);
  }
}
