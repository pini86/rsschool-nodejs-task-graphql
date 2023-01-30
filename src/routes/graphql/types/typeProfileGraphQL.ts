import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const profileDTO = {
  avatar: {
    type: GraphQLString,
  },
  sex: {
    type: GraphQLString,
  },
  birthday: {
    type: GraphQLInt,
  },
  country: {
    type: GraphQLString,
  },
  street: {
    type: GraphQLString,
  },
  city: {
    type: GraphQLString,
  },
  memberTypeId: {
    type: new GraphQLNonNull(GraphQLString),
  },
};

const typeProfileGraphQL = new GraphQLObjectType({
  name: 'profileGraphQL',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...profileDTO,
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export { typeProfileGraphQL };
