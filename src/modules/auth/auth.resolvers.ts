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
                const token = authService.signUp(email, password, name)

                return {
                    ok: true,
                    token
                }
            } catch (err) {
                return {
                    ok: false,
                    error: 'Error' + err
                }
            }
        },
        login: async (_, args, context) => {
            const {email, password} = args


            try {
                const authService = Container.get(AuthService)
                const token = authService.login(email, password)

                return {
                    ok: true,
                    token
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