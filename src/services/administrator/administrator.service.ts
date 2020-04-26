import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'entities/Administrator.entity';
import { Repository } from 'typeorm';
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';

@Injectable()
export class AdministratorService {

    constructor(     
        @InjectRepository(Administrator)
        private readonly administrator: Repository<Administrator>
        ){

    }

    getAll(): Promise<Administrator[]>{
        return this.administrator.find();
    }

    getById(id: number): Promise<Administrator>{
        return this.administrator.findOne(id);
    }

    add(data: AddAdministratorDto): Promise<Administrator>{
        const crypto = require('crypto');

        const passwordhash = crypto.createHash('sha512');
        passwordhash.update(data.password);
        const passHashString = passwordhash.digest('hex').toUpperCase();

        let admin: Administrator = new Administrator();
        admin.username = data.username;
        admin.passwordHash = passHashString;

        return this.administrator.save(admin);

    }

    async editById(adminId: number, data: EditAdministratorDto): Promise<Administrator>{
        let admin: Administrator = await this.administrator.findOne(adminId);

        const crypt = require('crypto');
        const passHash = crypt.createHash('sha512');
        passHash.update(data.password);
        let passHashString: string = passHash.digest('hex').toUpperCase();

        admin.passwordHash = passHashString;

        return this.administrator.save(admin);
        // return this.administrator.update(id);
    }
}
