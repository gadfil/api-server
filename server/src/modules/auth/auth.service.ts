import {User} from '../user/index'
import {Account} from '../account/index'
import {validate} from "class-validator";
import {Service} from "typedi";
import {EntityManager} from "typeorm";
import {InjectManager} from "typeorm-typedi-extensions";
import * as jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt'
import * as _ from "lodash";

const {
    SchemaDirectiveVisitor,
    AuthenticationError,
    ForbiddenError,
} = require('apollo-server-express');
@Service()
export default class AuthService {
    @InjectManager()
    private manager: EntityManager

    private generateToken(user: User): string {
        return jwt.sign({id: user.id}, process.env.JWT_SECRET, {
            expiresIn: '2 days',
        });
    }

    public async signUp(email: string, password: string, name: string): Promise<string> {
        try {
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
            await this.manager.save(user)
            return this.generateToken(user)


        } catch (e) {
            throw  new Error('This email is already registered');

        }

    }

    public async login(email: string, password: string): Promise<string> {
        const user = await this.manager.findOne(User, {email})
        if (user) {
            const valid = await bcrypt.compare(password, user.password)
            if (valid) {
                return this.generateToken(user)
            } else {
                throw new Error('Incorrect username or password')
            }

        } else {
            throw new Error('Incorrect username or password')
        }


    }


    public async getUserAccountFromToken(token: string): Promise<Account | null> {

        try {
            const payload = await jwt.verify(token, process.env.JWT_SECRET);
            if (payload) {
                const user = await this.manager.findOne(User, {id: payload.id}, {relations: ["account"]})

                if (user) {

                    return user.account
                } else {
                    return null
                }
            } else {
                return null
            }
        } catch (e) {
            return null
        }

    }

    public async getUserAccauntFromRequest(request: any): Promise<Account | null> {

        const token = _.get(request, 'cookies.token', null) || _.get(request, 'headers.authorization', null)
        if (token) {
            return await this.getUserAccountFromToken(token.replace("Bearer ", ""))
        } else {

            return null
        }

    }


}
