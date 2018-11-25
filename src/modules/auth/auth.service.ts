import {User} from '../user/index'
import {Account} from '../account/index'
import {validate} from "class-validator";
import {Service} from "typedi";
import {EntityManager} from "typeorm";
import {InjectManager} from "typeorm-typedi-extensions";

@Service()
export default  class AuthService {
    @InjectManager()
    private manager: EntityManager;

    public async signUp(email: string, password: string, name: string) {
        const account = new Account()
        account.name = name
        account.email = email
        const accountErrors = await validate(account);
        if (accountErrors.length > 0) {
            throw new Error(`Validation failed! `);
        }
        await this.manager.save(account)

        const user = new User()
        user.account = account
        user.password = password
        user.email = email

        const errors = await validate(user);
        if (errors.length > 0) {
            throw new Error(`Validation failed! `);
        }
        this.manager.save(user)


    }

}
