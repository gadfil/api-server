import 'reflect-metadata';
import {createConnection, getManager} from "typeorm";
import {resolvers, typeDefs} from "./modules";

const {ApolloServer, gql} = require('apollo-server');


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

