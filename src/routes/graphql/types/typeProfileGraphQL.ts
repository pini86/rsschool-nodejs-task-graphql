import { GraphQLObjectType, GraphQLString } from 'graphql';

const typeProfileGraphQL = new GraphQLObjectType({
  name: 'profileGraphQL',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLString },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
  }),
});

export { typeProfileGraphQL };
