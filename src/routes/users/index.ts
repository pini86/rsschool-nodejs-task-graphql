import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";
import { HttpError } from "@fastify/sensible/lib/httpError";
import validator from "validator";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | HttpError> {
      if (!validator.isUUID(request.params.id)) {
        return fastify.httpErrors.notFound();
      }
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      return user ? user : fastify.httpErrors.notFound();
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { firstName, lastName, email } = request.body;
      return fastify.db.users.create({
        firstName,
        lastName,
        email,
      });
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | HttpError> {
      if (!validator.isUUID(request.params.id)) {
        return fastify.httpErrors.badRequest();
      }
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!user) {
        return fastify.httpErrors.notFound();
      }

      const subsUsers = await fastify.db.users.findMany({
        key: "subscribedToUserIds",
        inArray: request.params.id,
      });

      subsUsers.forEach(async (subsUser) => {
        const subscribedToUserIds = subsUser.subscribedToUserIds.filter(
          (id) => {
            id !== request.params.id;
          }
        );

        await fastify.db.users.change(subsUser.id, {
          subscribedToUserIds,
        });
      });

      return fastify.db.users.delete(request.params.id);
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | HttpError> {
      if (
        !validator.isUUID(request.params.id) ||
        !validator.isUUID(request.body.userId)
      ) {
        return fastify.httpErrors.badRequest();
      }
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      const userSubs = await fastify.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });
      if (!user || !userSubs) {
        return fastify.httpErrors.badRequest();
      }

      const listSubscribe = new Set(userSubs.subscribedToUserIds).add(
        request.params.id
      );

      return fastify.db.users.change(request.body.userId, {
        subscribedToUserIds: Array.from(listSubscribe),
      });
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | HttpError> {
      if (
        !validator.isUUID(request.params.id) ||
        !validator.isUUID(request.body.userId)
      ) {
        return fastify.httpErrors.badRequest();
      }
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      const userSubs = await fastify.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });
      if (
        !user ||
        !userSubs ||
        !userSubs.subscribedToUserIds.includes(user.id)
      ) {
        return fastify.httpErrors.badRequest();
      }

      const subscribedToUserIds = userSubs.subscribedToUserIds.filter(
        (item) => item !== request.params.id
      );

      return fastify.db.users.change(request.body.userId, {
        subscribedToUserIds,
      });
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | HttpError> {
      if (!validator.isUUID(request.params.id)) {
        return fastify.httpErrors.badRequest();
      }
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!user) {
        return fastify.httpErrors.badRequest();
      }

      const {
        firstName = user.firstName,
        lastName = user.lastName,
        email = user.email,
      } = request.body;
      return fastify.db.users.change(request.params.id, {
        firstName,
        lastName,
        email,
      });
    }
  );
};

export default plugin;
