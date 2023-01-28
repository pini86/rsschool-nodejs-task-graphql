import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {
  graphql,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { typeUserGraphQL } from './types/typeUserGraphQL';
import { typePostGraphQL } from './types/typePostGraphQL';
import { typeProfileGraphQL } from './types/typeProfileGraphQL';
import { typeMemberTypeGraphQL } from './types/typeMemberTypeGraphQL';
import { typeUserWithAllSpecGraphQL } from './types/typeUserWithAllSpecGraphQL';
import { typeUserWithSubscPostsGraphQL } from './types/typeUserWithSubscPosts';
import { typeUsersSubscWithProfileGraphQL } from './types/typeUsersSubscProfilesGraphQL';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const userWithAllSpecGraphQL = await typeUserWithAllSpecGraphQL(fastify);
      const userWithSubscPosts = await typeUserWithSubscPostsGraphQL(fastify);
      const usersSubscWithProfileGraphQL =
        await typeUsersSubscWithProfileGraphQL(fastify);
      const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
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
                return user ? user : fastify.httpErrors.notFound();
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
                return post ? post : fastify.httpErrors.notFound();
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
                return post ? post : fastify.httpErrors.notFound();
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
                const memberType = await fastify.db.memberTypes.findOne({
                  key: 'id',
                  equals: args.id,
                });
                return memberType ? memberType : fastify.httpErrors.notFound();
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
                return user ? user : fastify.httpErrors.notFound();
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
                return user ? user : fastify.httpErrors.notFound();
              },
            },
            UsersSubscWithProfile: {
              type: new GraphQLList(usersSubscWithProfileGraphQL),
              async resolve() {
                return await fastify.db.users.findMany();
              },
            },
          },
        }),
      });

      return graphql({
        schema,
        source: request.body.query as string,
      });
    }
  );
};

export default plugin;
