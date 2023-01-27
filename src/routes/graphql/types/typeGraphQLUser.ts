import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

const typeUserGraphQL = new GraphQLObjectType({
  name: 'userGraphQL',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
  }),
});

export { typeUserGraphQL };
