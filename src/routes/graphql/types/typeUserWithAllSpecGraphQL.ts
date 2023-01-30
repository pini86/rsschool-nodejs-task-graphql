import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { typeProfileGraphQL } from './typeProfileGraphQL';
import { typeMemberTypeGraphQL } from './typeMemberTypeGraphQL';
import { typeUserGraphQL } from './typeUserGraphQL';
import { typePostGraphQL } from './typePostGraphQL';
import { userDTO } from './typeUserGraphQL';

const typeUserWithAllSpecGraphQL = new GraphQLObjectType({
  name: 'typeUserWithAllSpecGraphQL',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...userDTO,
    subscribedToUser: {
      type: new GraphQLList(typeUserGraphQL),
    },
    posts: { type: new GraphQLList(typePostGraphQL) },
    profile: { type: typeProfileGraphQL },
    memberType: { type: typeMemberTypeGraphQL },
    userSubscribedTo: { type: new GraphQLList(typeUserGraphQL) },
  }),
});

export { typeUserWithAllSpecGraphQL };
