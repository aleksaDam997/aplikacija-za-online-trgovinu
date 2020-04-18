import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Administrator{

    @PrimaryGeneratedColumn({name: 'administrator_id', type: 'int', unsigned: true})
    administratorId: number;

    @Column({type: 'varchar', length: 128, unique: true})
    username: string;

    @Column({name: 'password_hash', length: 128, type: 'varchar'})
    pasword_hash: string;

}