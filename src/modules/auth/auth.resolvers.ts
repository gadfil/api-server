import {ResolverMap} from '../../util/resolverType'
import {Container} from "typedi";
import AuthService from './auth.service'

const resolver: ResolverMap = {
    Query: {
        hello: () => "Hello world!"
    },
    Mutation: {
        register: async (_, args, context) => {
            const {email, password, name} = args


            try {
                const authService = Container.get(AuthService)
                authService.signUp(email, password, name)

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