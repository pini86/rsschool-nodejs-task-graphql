import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { HttpError } from '@fastify/sensible/lib/httpError';
import validator from 'validator';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | HttpError> {
      if (!validator.isUUID(request.params.id)) {
        return fastify.httpErrors.notFound();
      }
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });
      console.log('profile.city ', profile?.city);
      return profile ? profile : fastify.httpErrors.notFound();
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | HttpError> {
      if (!validator.isUUID(request.body.userId)) {
        return fastify.httpErrors.badRequest();
      }
      const {
        avatar,
        sex,
        birthday,
        country,
        street,
        city,
        userId,
        memberTypeId,
      } = request.body;
      const profileTestExist = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: userId,
      });
      if (
        profileTestExist ||
        !(memberTypeId === 'basic' || memberTypeId === 'business')
      ) {
        return fastify.httpErrors.badRequest();
      }
      return fastify.db.profiles.create({
        avatar,
        sex,
        birthday,
        country,
        street,
        city,
        userId,
        memberTypeId,
      });
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | HttpError> {
      if (!validator.isUUID(request.params.id)) {
        return fastify.httpErrors.badRequest();
      }
      const userTestExist = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (!userTestExist) {
        return fastify.httpErrors.notFound();
      }
      return fastify.db.profiles.delete(request.params.id);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | HttpError> {
      const profileTestExist = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      console.log('################ patched profile ', profileTestExist?.city);
      debugger;
      if (!profileTestExist) {
        return fastify.httpErrors.badRequest();
      }

      const {
        avatar = profileTestExist.avatar,
        sex = profileTestExist.sex,
        birthday = profileTestExist.birthday,
        country = profileTestExist.country,
        street = profileTestExist.street,
        city = profileTestExist.city,
        memberTypeId = profileTestExist.memberTypeId,
      } = request.body;
      return fastify.db.profiles.change(request.params.id, {
        avatar,
        sex,
        birthday,
        country,
        street,
        city,
        memberTypeId,
      });
    }
  );
};

export default plugin;
