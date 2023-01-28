import { GraphQLList, GraphQLObjectType } from 'graphql';
import { FastifyInstance } from 'fastify';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { typeProfileGraphQL } from './typeProfileGraphQL';
import { typeUserGraphQL } from './typeUserGraphQL';

//2.5. Get users with their userSubscribedTo, profile.
const typeUsersSubscWithProfileGraphQL = async (fastify: FastifyInstance) => {
  const userSubscWithProfile = new GraphQLObjectType({
    name: 'UserWithProfileGraphQL',
    fields: {
      user: {
        type: typeUserGraphQL,
        resolve: async (userCurrent: UserEntity) => userCurrent,
      },
      userSubscribedTo: {
        type: new GraphQLList(typeUserGraphQL),
        resolve: async (userCurrent: UserEntity) => {
          return fastify.db.users.findMany({
            key: 'subscribedToUserIds',
            inArray: userCurrent.id,
          });
        },
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
    },
  });

  return userSubscWithProfile;
};

export { typeUsersSubscWithProfileGraphQL };
