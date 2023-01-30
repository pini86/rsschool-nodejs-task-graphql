import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const userDTO = {
  firstName: {
    type: GraphQLString,
  },
  lastName: {
    type: GraphQLString,
  },
  email: {
    type: GraphQLString,
  },
};

const typeUserGraphQL = new GraphQLObjectType({
  name: 'userGraphQL',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...userDTO,
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});

export { typeUserGraphQL, userDTO };
