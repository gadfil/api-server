import {User} from '../user/index'
import {Account} from '../account/index'
import {validate} from "class-validator";
import {Service} from "typedi";
import {EntityManager} from "typeorm";
import {InjectManager} from "typeorm-typedi-extensions";
import * as jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt'

@Service()
export default class AccountService {
    @InjectManager()
    private manager: EntityManager


    public async account(id: number): Promise<Account> {
        const account = await this.manager.findOne(Account, {id})
        if (account) {
            console.log(account)
            return account
        } else {
            throw new Error('Not found')
        }

    }
    public async accounts(count: number, offset:number): Promise<Account[]> {
        return await this.manager.find(Account, {skip:offset, take:count})

    }


    public async update(id:number, dataUpdate: any): Promise<Account> {
        const entity = await this.account(id)
        if(dataUpdate){
            const accountUpdate = await this.manager.merge(Account, entity, dataUpdate)
            await this.manager.save(Account, accountUpdate)
            return accountUpdate

        }else {
            throw new Error(`Account ${id} not found`)
        }


    }


}
