import { Controller, Get, Param, Put, Body, Post } from "@nestjs/common"
import { Administrator } from "src/entities/administrator.entity"
import { AdministratorService } from "src/services/administrator/administrator.service"
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { ApiResponse } from "misc/api.response.class";

@Controller('api/administrator/')
export class AdministratorController{

    constructor(
        private administratorService: AdministratorService
      ){}
    
      @Get()
      getAll(): Promise<Administrator[]>{
        return this.administratorService.getAll();
      }

      @Get(':id')
      getById(@Param('id') adminId: number): Promise<Administrator | ApiResponse>{
        
        return new Promise(async (resolve) => {
            let admin = await this.administratorService.getById(adminId);

            if(admin === undefined){
                resolve(new ApiResponse("error", -1002));
            }

            resolve(admin);
        });
    }
    
      @Put()
      add( @Body() data: AddAdministratorDto): Promise<Administrator | ApiResponse>{
        return this.administratorService.add(data);
      } 

      @Post(':id')
      edit(@Param('id') adminId: number, @Body() data: EditAdministratorDto): Promise<Administrator | ApiResponse>{
        return this.administratorService.editById(adminId, data);
      }
}