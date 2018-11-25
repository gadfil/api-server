import 'reflect-metadata';
import {createConnection, getManager, useContainer} from "typeorm";
import {resolvers, typeDefs} from "./modules";
import {Container} from "typedi";

const {ApolloServer, gql} = require('apollo-server');

useContainer(Container);

const bootstrap = async () => {
    try {

        const connection = await createConnection();
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: {manager: getManager()}
        });
        server.listen().then(({url}) => {
            console.log(`🚀  Server ready at ${url}`);
        });
    } catch (error) {
        console.error(error);
    }

}

bootstrap();

