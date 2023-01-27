import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {
  graphql,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { typeUserGraphQL } from './types/typeGraphQLUser';
import { typePostGraphQL } from './types/typePostGraphQL';

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
      const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'RootQueryType',
          fields: {
            getUser: {
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
            getUsers: {
              type: new GraphQLList(typeUserGraphQL),
              resolve() {
                return fastify.db.users.findMany();
              },
            },
            getPost: {
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
            getPosts: {
              type: new GraphQLList(typePostGraphQL),
              async resolve() {
                return fastify.db.posts.findMany();
              },
            },
          },
        }),
      });

      const resultGraphQL = await graphql({
        schema,
        source: request.body.query as string,
      });

      return resultGraphQL;
    }
  );
};

export default plugin;
