import {
  GraphQLID,
  GraphQLInt,
  // GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { typeUserGraphQL } from '../types/typeUserGraphQL';
import { typeProfileGraphQL } from '../types/typeProfileGraphQL';
import { typePostGraphQL } from '../types/typePostGraphQL';
import { FastifyInstance } from 'fastify';
import validator from 'validator';

/* 

import { typeMemberTypeGraphQL } from '../types/typeMemberTypeGraphQL';
import { typeUserWithAllSpecGraphQL } from '../types/typeUserWithAllSpecGraphQL';
import { typeUserWithSubscPostsGraphQL } from '../types/typeUserWithSubscPosts';
import { typeUsersSubscWithProfileGraphQL } from '../types/typeUsersSubscProfilesGraphQL';
import { typeUserWithSubscGraphQL } from '../types/typeUserWithSubscGraphQL';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes'; */

const rootMutation = async (
  fastify: FastifyInstance
): Promise<GraphQLObjectType> => {
  return new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: typeUserGraphQL,
        args: {
          firstName: { type: new GraphQLNonNull(GraphQLString) },
          lastName: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_, args) {
          const { firstName, lastName, email } = args;
          return await fastify.db.users.create({
            firstName,
            lastName,
            email,
          });
        },
      },
      createProfile: {
        type: typeProfileGraphQL,
        args: {
          userId: { type: new GraphQLNonNull(GraphQLID) },
          memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
          avatar: { type: new GraphQLNonNull(GraphQLString) },
          sex: { type: new GraphQLNonNull(GraphQLString) },
          birthday: { type: new GraphQLNonNull(GraphQLInt) },
          country: { type: new GraphQLNonNull(GraphQLString) },
          street: { type: new GraphQLNonNull(GraphQLString) },
          city: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_, args) {
          const user = await fastify.db.users.findOne({
            key: 'id',
            equals: args.userId,
          });

          if (!user) {
            return fastify.httpErrors.notFound('User not found');
          }

          const memberType = await fastify.db.memberTypes.findOne({
            key: 'id',
            equals: args.memberTypeId,
          });

          if (!memberType) {
            return fastify.httpErrors.badRequest('Wrong Member Type');
          }

          const checkProfile = await fastify.db.profiles.findOne({
            key: 'userId',
            equals: args.userId,
          });

          if (checkProfile) {
            return fastify.httpErrors.badRequest('Profile already exist');
          }

          const {
            userId,
            memberTypeId,
            avatar,
            sex,
            birthday,
            country,
            street,
            city,
          } = args;
          return fastify.db.profiles.create({
            userId,
            memberTypeId,
            avatar,
            sex,
            birthday,
            country,
            street,
            city,
          });
        },
      },
      createPost: {
        type: typePostGraphQL,
        args: {
          userId: { type: new GraphQLNonNull(GraphQLID) },
          title: { type: new GraphQLNonNull(GraphQLString) },
          content: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_, args) {
          const user = await fastify.db.users.findOne({
            key: 'id',
            equals: args.userId,
          });

          if (!user) {
            return fastify.httpErrors.notFound('User not found');
          }

          const { userId, title, content } = args;
          return fastify.db.posts.create({
            userId,
            title,
            content,
          });
        },
      },
      updateUser: {
        type: typeUserGraphQL,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          firstName: { type: new GraphQLNonNull(GraphQLString) },
          lastName: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_, args) {
          if (!validator.isUUID(args.id)) {
            return fastify.httpErrors.badRequest();
          }
          const user = await fastify.db.users.findOne({
            key: 'id',
            equals: args.id,
          });
          if (!user) {
            return fastify.httpErrors.notFound();
          }

          const {
            firstName = user.firstName,
            lastName = user.lastName,
            email = user.email,
          } = args;
          return fastify.db.users.change(args.id, {
            firstName,
            lastName,
            email,
          });
        },
      },
      updateProfile: {
        type: typeProfileGraphQL,
        args: {
          userId: { type: new GraphQLNonNull(GraphQLID) },
          memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
          avatar: { type: new GraphQLNonNull(GraphQLString) },
          sex: { type: new GraphQLNonNull(GraphQLString) },
          birthday: { type: new GraphQLNonNull(GraphQLInt) },
          country: { type: new GraphQLNonNull(GraphQLString) },
          street: { type: new GraphQLNonNull(GraphQLString) },
          city: { type: new GraphQLNonNull(GraphQLString) },
        },
        // resolve: async (_, args) => updateProfileFromInput(args.id, args.variables, fastify),
        async resolve(_, args) {
          const {
            userId,
            memberTypeId,
            avatar,
            sex,
            birthday,
            country,
            street,
            city,
          } = args;
          const user = await fastify.db.users.findOne({
            key: 'id',
            equals: userId,
          });

          if (!user) {
            return fastify.httpErrors.notFound('User not found');
          }

          const memberType = await fastify.db.memberTypes.findOne({
            key: 'id',
            equals: memberTypeId,
          });

          if (!memberType) {
            return fastify.httpErrors.badRequest('Wrong Member Type');
          }

          const checkProfile = await fastify.db.profiles.findOne({
            key: 'userId',
            equals: userId,
          });

          if (!checkProfile) {
            return fastify.httpErrors.badRequest('Profile not found');
          }

          return fastify.db.profiles.change(userId, {
            memberTypeId,
            avatar,
            sex,
            birthday,
            country,
            street,
            city,
          });
        },
      },
    },
  });
};

export { rootMutation };
