import {User} from '../user/index'
import {Account} from '../account/index'
import {validate} from "class-validator";
import {Service} from "typedi";
import {EntityManager} from "typeorm";
import {InjectManager} from "typeorm-typedi-extensions";
import * as jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt'

@Service()
export default class AuthService {
    @InjectManager()
    private manager: EntityManager

    private  generateToken(user: User):string {
        return jwt.sign({id: user.id}, process.env.JWT_SECRET, {
            expiresIn: '2 days',
        });
    }

    public async signUp(email: string, password: string, name: string): Promise<string> {
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
            throw  new Error(`Validation failed! `);
        }
        this.manager.save(user)

        return this.generateToken(user)


    }

    public async login(email: string, password: string): Promise<string> {
        console.log('login.s')
        const user = await this.manager.findOne(User, {email})
        console.log(user)
        if (user) {
            const valid = await bcrypt.compare(password, user.password)
            if(valid) {
                return this.generateToken(user)
            }else {
                throw new Error('Incorrect username or password')
            }

        } else {
            throw new Error('Incorrect username or password')
        }


    }


}
