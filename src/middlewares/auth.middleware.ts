import { NestMiddleware, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { NextFunction, Request, Response, } from "express";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as jwt from 'jsonwebtoken';
import { JwtDataAdministratorDto } from "src/dtos/administrator/jwt.data.administrator";
import { jwtSecret } from "config/jwt.secret";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(private readonly administratorService: AdministratorService){}

    async use(req: Request, res: Response, next: NextFunction) {

        if(!req.headers.authorization){
            throw new HttpException('Token not found!', HttpStatus.UNAUTHORIZED);
        }

        const token = req.headers.authorization;
        const tokenParts = token.split(" ");
        if(tokenParts.length !==2){

        }

        const tokenString = tokenParts[1];
        
        const jwtData: JwtDataAdministratorDto = jwt.verify(tokenString, jwtSecret, function(err, decoded){
            if(err){
                throw new HttpException('Bad token found no jwt data!', HttpStatus.UNAUTHORIZED);
            }
            return decoded;
        });

        if(!jwtData){
            throw new HttpException('Bad token found no jwt data!', HttpStatus.UNAUTHORIZED);
        }

        if(jwtData.ip !== req.ip.toString()){
            throw new HttpException('Bad token found wrong ip!', HttpStatus.UNAUTHORIZED);
        }

        if(jwtData.ua !== req.headers['user-agent']){
            throw new HttpException('Bad token found no ua!', HttpStatus.UNAUTHORIZED);
        }

        const administrator = this.administratorService.getById(jwtData.administratorId);

        if(!administrator){
            throw new HttpException('Account not found!', HttpStatus.UNAUTHORIZED);
        }

        const trenutniTimeStamp = new Date().getTime() / 1000;

        if(trenutniTimeStamp >= jwtData.exp){
            throw new HttpException('AThe token has expired!', HttpStatus.UNAUTHORIZED);
        }

        next();
    }

}