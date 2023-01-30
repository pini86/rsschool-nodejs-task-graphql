import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';

const memberTypeDTO = {
  discount: {
    type: GraphQLInt,
  },
  monthPostsLimit: {
    type: GraphQLInt,
  },
};

const typeMemberTypeGraphQL = new GraphQLObjectType({
  name: 'memberTypeGraphQL',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...memberTypeDTO,
  }),
});

export { typeMemberTypeGraphQL };
