import {
  // GraphQLID,
  // GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { typeUserGraphQL } from '../types/typeUserGraphQL';
import { FastifyInstance } from 'fastify';
/* import { typePostGraphQL } from '../types/typePostGraphQL';
import { typeProfileGraphQL } from '../types/typeProfileGraphQL';
import { typeMemberTypeGraphQL } from '../types/typeMemberTypeGraphQL';
import { typeUserWithAllSpecGraphQL } from '../types/typeUserWithAllSpecGraphQL';
import { typeUserWithSubscPostsGraphQL } from '../types/typeUserWithSubscPosts';
import { typeUsersSubscWithProfileGraphQL } from '../types/typeUsersSubscProfilesGraphQL';
import { typeUserWithSubscGraphQL } from '../types/typeUserWithSubscGraphQL';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes'; */

const rootMutation = async (
  fastify: FastifyInstance
): Promise<GraphQLObjectType> => {
  return new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: typeUserGraphQL,
        args: {
          firstName: { type: new GraphQLNonNull(GraphQLString) },
          lastName: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_, args) {
          const { firstName, lastName, email } = args;
          return fastify.db.users.create({
            firstName,
            lastName,
            email,
          });
        },
      },
    },
  });
};

export { rootMutation };
