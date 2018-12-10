import {BaseEntity, BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique} from 'typeorm'
import * as bcrypt from 'bcrypt'
import {Account} from "../account";
import {IsEmail, IsNotEmpty} from "class-validator";


@Entity()
@Unique(["email"])
export default class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsEmail()
    email: string

    @Column()
    @IsNotEmpty()
    password: string

    @Column()
    salt:string

    @OneToOne(type => Account)
    @JoinColumn()
    account: Account

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSaltSync(10);
        const password =  await bcrypt.hashSync(this.password, salt);

        this.password = password;
        this.salt = salt
    }


}