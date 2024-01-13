import { Controller, Bind, Get, Req } from '@nestjs/common';

@Controller('clustering')
export class ClusterController {
  @Get()
  @Bind(Req())
  findAll(request) {
    return 'This action returns all cats';
  }
}
