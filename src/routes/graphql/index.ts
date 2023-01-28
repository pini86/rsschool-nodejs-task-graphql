import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, GraphQLSchema } from 'graphql';
import { rootQuery } from './query/rootQuery';

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
      });

      return graphql({
        schema,
        source: request.body.query as string,
        contextValue: fastify,
      });
    }
  );
};

export default plugin;
