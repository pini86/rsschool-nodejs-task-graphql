import { GraphQLList, GraphQLObjectType } from 'graphql';
import { FastifyInstance } from 'fastify';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { typeProfileGraphQL } from './typeProfileGraphQL';
import { typePostGraphQL } from './typePostGraphQL';
import { typeMemberTypeGraphQL } from './typeMemberTypeGraphQL';
import { typeUserGraphQL } from './typeUserGraphQL';

const typeUserWithAllSpecGraphQL = async (fastify: FastifyInstance) => {
  const userWithAllSpec = new GraphQLObjectType({
    name: 'typeUserWithAllSpecGraphQL',
    fields: () => ({
      user: {
        type: typeUserGraphQL,
        resolve: async (userCurrent: UserEntity) => userCurrent,
      },
      profile: {
        type: typeProfileGraphQL,
        resolve: async (userCurrent: UserEntity) => {
          return fastify.db.profiles.findOne({
            key: 'userId',
            equals: userCurrent.id,
          });
        },
      },
      posts: {
        type: new GraphQLList(typePostGraphQL),
        resolve: async (userCurrent: UserEntity) => {
          return fastify.db.posts.findMany({
            key: 'userId',
            equals: userCurrent.id,
          });
        },
      },
      memberType: {
        type: typeMemberTypeGraphQL,
        resolve: async (userCurrent: UserEntity) => {
          const userCurrentProfile = await fastify.db.profiles.findOne({
            key: 'userId',
            equals: userCurrent.id,
          });

          if (!userCurrentProfile) {
            return null;
          }

          return fastify.db.memberTypes.findOne({
            key: 'id',
            equals: userCurrentProfile.memberTypeId,
          });
        },
      },
    }),
  });

  return userWithAllSpec;
};

export { typeUserWithAllSpecGraphQL };
