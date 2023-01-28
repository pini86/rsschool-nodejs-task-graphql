import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, GraphQLSchema } from 'graphql';
import { rootQuery } from './query/rootQuery';
import { rootMutation } from './mutation/rootMutation';

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
        query: await rootQuery(fastify),
        mutation: await rootMutation(fastify),
      });

      return graphql({
        schema,
        source: String(request.body.query),
      });
    }
  );
};

export default plugin;
