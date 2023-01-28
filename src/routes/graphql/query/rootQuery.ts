import { GraphQLID, GraphQLList, GraphQLObjectType } from 'graphql';
import { typeUserGraphQL } from '../types/typeUserGraphQL';
import { typePostGraphQL } from '../types/typePostGraphQL';
import { typeProfileGraphQL } from '../types/typeProfileGraphQL';
import { typeMemberTypeGraphQL } from '../types/typeMemberTypeGraphQL';
import { typeUserWithAllSpecGraphQL } from '../types/typeUserWithAllSpecGraphQL';
import { typeUserWithSubscPostsGraphQL } from '../types/typeUserWithSubscPosts';
import { typeUsersSubscWithProfileGraphQL } from '../types/typeUsersSubscProfilesGraphQL';
import { typeUserWithSubscGraphQL } from '../types/typeUserWithSubscGraphQL';
import { FastifyInstance } from 'fastify';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';

const rootQuery = async (
  fastify: FastifyInstance
): Promise<GraphQLObjectType> => {
  const userWithAllSpecGraphQL = await typeUserWithAllSpecGraphQL(fastify);
  const userWithSubscPosts = await typeUserWithSubscPostsGraphQL(fastify);
  const usersSubscWithProfileGraphQL = await typeUsersSubscWithProfileGraphQL(
    fastify
  );
  const userWithSubscGraphQL = await typeUserWithSubscGraphQL(fastify);

  return new GraphQLObjectType({
    name: 'Query',
    fields: {
      User: {
        type: typeUserGraphQL,
        args: {
          id: { type: GraphQLID },
        },
        async resolve(_, args) {
          const user = await fastify.db.users.findOne({
            key: 'id',
            equals: args.id,
          });
          return user ? user : fastify.httpErrors.notFound('User not found');
        },
      },
      Users: {
        type: new GraphQLList(typeUserGraphQL),
        resolve() {
          return fastify.db.users.findMany();
        },
      },
      Post: {
        type: typePostGraphQL,
        args: {
          id: { type: GraphQLID },
        },
        async resolve(_, args) {
          const post = await fastify.db.posts.findOne({
            key: 'id',
            equals: args.id,
          });
          return post ? post : fastify.httpErrors.notFound('Post not found');
        },
      },
      Posts: {
        type: new GraphQLList(typePostGraphQL),
        async resolve() {
          return fastify.db.posts.findMany();
        },
      },
      Profile: {
        type: typeProfileGraphQL,
        args: {
          id: { type: GraphQLID },
        },
        async resolve(_, args) {
          const post = await fastify.db.profiles.findOne({
            key: 'id',
            equals: args.id,
          });
          return post ? post : fastify.httpErrors.notFound('Profile not found');
        },
      },
      Profiles: {
        type: new GraphQLList(typeProfileGraphQL),
        async resolve() {
          return fastify.db.profiles.findMany();
        },
      },
      MemberType: {
        type: typeMemberTypeGraphQL,
        args: {
          id: { type: GraphQLID },
        },
        async resolve(_, args) {
          const memberType: MemberTypeEntity | null =
            await fastify.db.memberTypes.findOne({
              key: 'id',
              equals: args.id,
            });
          return memberType
            ? memberType
            : fastify.httpErrors.notFound('Member Type not found');
        },
      },
      MemberTypes: {
        type: new GraphQLList(typeMemberTypeGraphQL),
        async resolve() {
          return fastify.db.memberTypes.findMany();
        },
      },
      UserWithAllSpec: {
        type: userWithAllSpecGraphQL,
        args: {
          id: { type: GraphQLID },
        },
        async resolve(_, args) {
          const user = await fastify.db.users.findOne({
            key: 'id',
            equals: args.id,
          });
          return user ? user : fastify.httpErrors.notFound('User not found');
        },
      },
      UsersWithAllSpec: {
        type: new GraphQLList(userWithAllSpecGraphQL),
        async resolve() {
          return fastify.db.users.findMany();
        },
      },
      UserWithSubscPosts: {
        type: userWithSubscPosts,
        args: {
          id: { type: GraphQLID },
        },
        async resolve(_, args) {
          const user = await fastify.db.users.findOne({
            key: 'id',
            equals: args.id,
          });
          return user ? user : fastify.httpErrors.notFound('User not found');
        },
      },
      UsersSubscWithProfile: {
        type: new GraphQLList(usersSubscWithProfileGraphQL),
        async resolve() {
          return await fastify.db.users.findMany();
        },
      },
      UsersWithSubsc: {
        type: new GraphQLList(userWithSubscGraphQL),
        async resolve() {
          return fastify.db.users.findMany();
        },
      },
    },
  });
};

export { rootQuery };
