import { GraphQLList, GraphQLObjectType } from 'graphql';
import { FastifyInstance } from 'fastify';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { typeUserGraphQL } from './typeUserGraphQL';
import { typePostGraphQL } from './typePostGraphQL';

//2.6. Get user by id with his subscribedToUser, posts.
const typeUserWithSubscPosts = async (fastify: FastifyInstance) => {
  const userWithSubscPosts = new GraphQLObjectType({
    name: 'UserWithSubscPosts',
    fields: {
      user: {
        type: typeUserGraphQL,
        resolve: async (userCurrent: UserEntity) => userCurrent,
      },
      subscribedToUser: {
        type: new GraphQLList(typeUserGraphQL),
        resolve: async (userCurrent: UserEntity) => {
          const { subscribedToUserIds } = userCurrent;
          const listSubscToUser = await Promise.all(
            subscribedToUserIds.map(async (userSubsc) => {
              const user = await fastify.db.users.findOne({
                key: 'id',
                equals: userSubsc,
              });
              return user;
            })
          );
          return listSubscToUser;
        },
      },
      posts: {
        type: new GraphQLList(typePostGraphQL),
        resolve: async (userCurrent: UserEntity) => {
          const posts = await fastify.db.posts.findMany({
            key: 'userId',
            equals: userCurrent.id,
          });
          return posts;
        },
      },
    },
  });

  return userWithSubscPosts;
};

export { typeUserWithSubscPosts };
