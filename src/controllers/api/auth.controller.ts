import { Controller, Post, Body, Req } from "@nestjs/common";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { ApiResponse } from "misc/api.response.class";
import { LoginInfoAdministratorDto } from "src/dtos/administrator/login.info.administrator.dto";
import * as jwt from 'jsonwebtoken';
import { JwtDataAdministratorDto } from "src/dtos/administrator/jwt.data.administrator";
import { Request, response } from "express";
import { jwtSecret } from "config/jwt.secret";
import * as crypto from 'crypto';

@Controller('auth')
export class AuthController{
    constructor(public administratorService: AdministratorService){}

@Post('/login')
async doLogin(@Body() data: LoginAdministratorDto, @Req() req: Request): Promise<ApiResponse | LoginInfoAdministratorDto>{

    const admin = await this.administratorService.getByUsername(data.username);

    if(!admin){
        return new Promise(resolve => resolve(new ApiResponse("Administrator nije pronadjen", -3001)));        
    }

    // const crypto = require('crypto');
    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(data.password);
    const passwordHashString = passwordHash.digest('hex').toUpperCase();

    if(admin.passwordHash != passwordHashString){
        return new Promise(resolve => resolve(new ApiResponse("error", -3002)));        

    }

    let jwtData = new JwtDataAdministratorDto();

    jwtData.administratorId = admin.administratorId;
    jwtData.username = admin.username;

    let sada: Date = new Date();
    sada.setDate(sada.getDate() + 14);
    // console.log(sada);
    const istekTimeStamp = sada.getTime() / 1000;
    jwtData.exp = istekTimeStamp;
    // console.log(jwtData.exp);
    jwtData.ip = req.ip.toString();
    jwtData.ua = req.headers["user-agent"];

    // const jwt = require('jsonwebtoken');

    const token = jwt.sign(jwtData.toPlainObject(), jwtSecret);
    //JSON.parse(JSON.stringify(jwtData)) ako nece jwtData.toPlainObject()

    const responseObject: LoginInfoAdministratorDto = new LoginInfoAdministratorDto(admin.administratorId, admin.username, token);
    // console.log(responseObject);
    return new Promise(response => response(responseObject));
}




}