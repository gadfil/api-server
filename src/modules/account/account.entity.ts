import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {Photo} from "../photo";
import {IsEmail, IsNotEmpty} from "class-validator";

@Entity()
export default class Account extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsEmail()
    email: string

    @Column()
    @IsNotEmpty()
    name: string

    /**
     * ISO/IEC 5218 Information technology — Codes for the representation of human sexes
     * The four codes specified in ISO/IEC 5218 are:
     * 0 = not known^
     * 1 = male
     * 2 = female
     * 9 = not applicable
     */
    @Column({default: 0})
    sex: number

    @Column({default: ''})
    description: string

    //
    // @OneToMany(() => Photo, photo => photo.account)
    // photos: Photo[]
}