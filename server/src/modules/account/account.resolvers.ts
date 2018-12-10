import {ResolverMap} from '../../util/resolverType'
import {Container} from "typedi";
import AccountService from "./account.service";
import {ForbiddenError} from "apollo-server"

const resolver: ResolverMap = {

    Query: {
        account: async (_, args, context) => {
            const {id} = args
            try {
                const accountService = Container.get(AccountService)
                return accountService.account(id)
            } catch (e) {
                throw  new Error(e.toString());
            }

        },
        accounts: async (_, args, context) => {
            const {count, offset} = args
            try {
                const accountService = Container.get(AccountService)
                return accountService.accounts(count, offset)
            } catch (e) {
                throw  new Error(e.toString());
            }
        }
    },
    Mutation: {
        updateAccount: async (_, args, context) => {
            const {input, id} = args
            try {
                const accountService = Container.get(AccountService)
                if(context.account.id == id) {
                    const result = await accountService.update(id, input)
                    return result
                }else {
                    throw  new ForbiddenError('Forbidden Error');

                }
            } catch (e) {
                throw  new Error(e.toString());
            }
        },
    }
}
export default resolver