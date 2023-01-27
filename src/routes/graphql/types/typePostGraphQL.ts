import { GraphQLObjectType, GraphQLString } from 'graphql';

const typePostGraphQL = new GraphQLObjectType({
  name: 'postGraphQL',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});

export { typePostGraphQL };
