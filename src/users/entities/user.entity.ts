import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({nullable : false, type : 'varchar', length : 20})
    username : string;

    @Column({nullable : false, type : 'text', unique : true})
    email : string;

    @Column({nullable : false, type : 'text'})
    password : string

    @Column({type : 'text', nullable : true})
    refreshToken : string
}
