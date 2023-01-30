import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

const postDTO = {
  title: {
    type: GraphQLString,
  },
  content: {
    type: GraphQLString,
  },
};

const typePostGraphQL = new GraphQLObjectType({
  name: 'postGraphQL',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...postDTO,
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export { typePostGraphQL };
