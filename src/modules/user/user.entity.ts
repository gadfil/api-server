import {BaseEntity, BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm'
import * as bcrypt from 'bcrypt'
import {Account} from "../account";


@Entity()
export default class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
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

    checkPassword(rawPassword: string): Promise<boolean> {
        return bcrypt.compare(rawPassword, this.password)
    }
}