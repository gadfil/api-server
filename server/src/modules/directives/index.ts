import {GraphQLField} from "graphql";

import {Account} from '../account'

const {
    SchemaDirectiveVisitor,
    AuthenticationError,
    ForbiddenError,
} = require('apollo-server-express');
const {defaultFieldResolver} = require('graphql');


interface AccessService {
    userHasRoleNames(account: Account, roles: string[]): Promise<boolean>;
}


// export const getAuthDirectiveVisitor = (accessService: AccessService) =>
export class AuthDirectiveVisitor extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: GraphQLField<any, any>
                         // details: {
                         //   objectType: GraphQLObjectType | GraphQLInterfaceType;
                         // }
    ): GraphQLField<any, any> | void {
        // const isInQueryType = details.objectType.name === 'Query';
        // const isInMutationType = details.objectType.name === 'Mutation';

        // if (!(isInQueryType || isInMutationType)) {
        //   throw Error('Directive @auth can only be used in Mutations or Queries');
        // }

        const previousResolve = field.resolve;
        const requiredRoles = this.args.requires as string[];

        field.resolve = async (root, params, context, info) => {

            const account = await context.account as Account;
            console.log('d', account)
            if (!account) {
                throw new AuthenticationError('Invalid authentication');
            }

            /**
             if (!(await accessService.userHasRoleNames(account, requiredRoles))) {
                    console.log('needs', requiredRoles);
                    // console.log('has', account.roles!!.map(it => it.name));
                    console.log('userid', account.id);
                    throw new ForbiddenError('User does not have enough permissions');
                }
             */

            return previousResolve
                ? previousResolve(root, params, context, info)
                : root[field.name];
        };

        return field;
    }
};
