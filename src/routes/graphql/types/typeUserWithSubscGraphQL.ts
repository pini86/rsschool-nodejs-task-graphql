import { GraphQLList, GraphQLObjectType, GraphQLOutputType } from 'graphql';
import { FastifyInstance } from 'fastify';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { typeUserGraphQL } from './typeUserGraphQL';

//2.7. Get users with their userSubscribedTo, subscribedToUser (additionally for each user in userSubscribedTo, subscribedToUser add their userSubscribedTo, subscribedToUser).
const configuration = typeUserGraphQL.toConfig();

const typeUserWithSubscGraphQL = async (fastify: FastifyInstance) => {
  const userWithSubsc: GraphQLOutputType = new GraphQLObjectType({
    ...configuration,
    name: 'userWithSubscGraphQL',
    fields: () => ({
      ...configuration.fields,
      subscribedToUser: {
        type: new GraphQLList(userWithSubsc),
        resolve: async (userCurrent: UserEntity) => {
          const { subscribedToUserIds } = userCurrent;
          const subscribedToUser = await Promise.all(
            subscribedToUserIds.map(async (subscribedToUserId) => {
              const user = await fastify.db.users.findOne({
                key: 'id',
                equals: subscribedToUserId,
              });
              return user;
            })
          );
          return subscribedToUser;
        },
      },
      userSubscribedTo: {
        type: new GraphQLList(userWithSubsc),
        resolve: async (userCurrent: UserEntity) => {
          const userSubscribedTo = await fastify.db.users.findMany({
            key: 'subscribedToUserIds',
            inArray: userCurrent.id,
          });
          return userSubscribedTo;
        },
      },
    }),
  });

  return userWithSubsc;
};

export { typeUserWithSubscGraphQL };
