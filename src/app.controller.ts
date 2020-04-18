import { Controller, Get } from '@nestjs/common';
import { AdministratorService } from './services/administrator/administrator.service';
import { Administrator } from 'entities/Administrator.entity';

@Controller()
export class AppController {

  constructor(
    private administratorService: AdministratorService
  ){}

  @Get() // http://localhost:3000/
  getIndex(): string {
    return 'Home page';
  }

  @Get('api/administrator')
  getAllAdmins(): Promise<Administrator[]>{
    return this.administratorService.getAll();
  }
}
