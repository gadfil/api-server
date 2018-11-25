import {mergeResolvers, fileLoader, mergeTypes} from "merge-graphql-schemas";
import * as path from "path";

const resolversArray = fileLoader(path.join(__dirname, "./**/*.resolvers.*"));
const typesArray = fileLoader(path.join(__dirname, "./**/*.schema.*"));

export const typeDefs = mergeTypes(typesArray);
export const resolvers = mergeResolvers(resolversArray);
