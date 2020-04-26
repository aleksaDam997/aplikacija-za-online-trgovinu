import { Controller, Get, Param, Put, Body, Post } from "@nestjs/common"
import { Administrator } from "entities/administrator.entity"
import { AdministratorService } from "src/services/administrator/administrator.service"
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";

@Controller('api/administrator')
export class AdministratorController{

    constructor(
        private administratorService: AdministratorService
      ){}
    
      @Get()
      getAll(): Promise<Administrator[]>{
        return this.administratorService.getAll();
      }

      @Get(':id')
      getById(@Param('id') adminId: number){
          this.administratorService.getById(adminId);
      }
    
      @Put()
      add( @Body() data: AddAdministratorDto): Promise<Administrator>{
        return this.administratorService.add(data);
      } 

      @Post(':id')
      edit(@Param('id') adminId: number, @Body() data: EditAdministratorDto): Promise<Administrator>{
        return this.administratorService.editById(adminId, data);
      }
}