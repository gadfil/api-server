import 'reflect-metadata';
import {createConnection, useContainer} from "typeorm";
import {resolvers, typeDefs} from "./modules";
import {Container} from "typedi";
import *as dotenv from "dotenv"
import AuthService from "./modules/auth/auth.service";
import {AuthDirectiveVisitor, } from "./modules/directives";

import getUploadRouter from './modules/file/server-generate-sign-url'
const {ApolloServer, gql} = require('apollo-server');
dotenv.config()

useContainer(Container);

const bootstrap = async () => {
    try {

        const connection = await createConnection();
        const authService = Container.get(AuthService)
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTU0MzY4MTg3OSwiZXhwIjoxNTQzODU0Njc5fQ.dYdf2fTQi3Vd_4hKVVs8QlpnhTsSTBMCAcQqWpKaSoo
            context: async ({req}) => {
                const account = await authService.getUserAccauntFromRequest(req)

                return {account}

            },
            schemaDirectives: {
                auth: AuthDirectiveVisitor,
            }
        });
        server.listen().then(({url}) => {
            console.log(`🚀  Server ready at ${url}`);
            // const uploadUrl = getUploadRouter()
            // console.log('upload to ', uploadUrl)
        });
    } catch (error) {
        console.error(error);
    }

}

bootstrap();

