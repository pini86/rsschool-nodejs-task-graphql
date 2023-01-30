import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {
  graphql,
  GraphQLSchema,
  parse,
  validate,
  ExecutionResult,
} from 'graphql';
import { rootQuery } from './query/rootQuery';
import { rootMutation } from './mutation/rootMutation';
import * as limitDepth from 'graphql-depth-limit';

const LIMIT_DEPTH = 6;

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
      const { query, variables } = request.body;
      if (!query) {
        return fastify.httpErrors.badRequest('Wrong query');
      }
      const schema = new GraphQLSchema({
        query: await rootQuery(fastify),
        mutation: await rootMutation(fastify),
      });
      const errors_validation = validate(schema, parse(query!), [
        limitDepth(LIMIT_DEPTH),
      ]);

      if (errors_validation.length) {
        return {
          errors: errors_validation,
          data: null,
        } as ExecutionResult;
      }
      return graphql({
        schema,
        source: String(query),
        variableValues: variables,
      });
    }
  );
};

export default plugin;
