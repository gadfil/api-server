import {ResolverMap} from '../../util/resolverType'
import {User} from '../user/index'
import {Account} from '../account/index'
import {validate} from "class-validator";
import {Context} from "../../server";

const resolver: ResolverMap = {
    Query: {
        hello: () => "Hello world!"
    },
    Mutation: {
        register: async (_, args, context) => {
            const {email, password, name} = args


            try {

                const account = new Account()
                account.email = email;
                account.name = name
                const errors = await validate(account);
                if (errors.length > 0) {
                    throw new Error(`Validation failed! `);
                }
                await context.manager.save(account)

                const user = new User()
                user.email = email
                user.password = password
                user.account = account

                await context.manager.save(user)
                return {
                    ok: true
                }
            } catch (err) {
                return {
                    ok: false,
                    error: 'Error' + err
                }
            }
        }
    }
}
export default resolver