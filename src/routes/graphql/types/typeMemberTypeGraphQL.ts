import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

const typeMemberTypeGraphQL = new GraphQLObjectType({
  name: 'memberTypeGraphQL',
  fields: () => ({
    id: { type: GraphQLString },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});

export { typeMemberTypeGraphQL };
