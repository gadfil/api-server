import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {Account} from '../account'

@Entity()
export default class Photo extends BaseEntity {
    @PrimaryGeneratedColumn() id: number

    @Column() url: string

    @Column({ nullable: true })
    userId: number

    // @ManyToOne(() => Account, account => account.photos)
    // account: Account
}