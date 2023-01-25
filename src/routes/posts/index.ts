import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createPostBodySchema, changePostBodySchema } from "./schema";
import type { PostEntity } from "../../utils/DB/entities/DBPosts";
import { HttpError } from "@fastify/sensible/lib/httpError";
import validator from "validator";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<PostEntity[]> {
    return fastify.db.posts.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | HttpError> {
      if (!validator.isUUID(request.params.id)) {
        return fastify.httpErrors.notFound();
      }
      const post = await fastify.db.posts.findOne({
        key: "id",
        equals: request.params.id,
      });
      return post ? post : fastify.httpErrors.notFound();
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity | HttpError> {
      const { title, content, userId } = request.body;
      if (!validator.isUUID(userId)) {
        return fastify.httpErrors.badRequest();
      }
      const userTestExist = await fastify.db.users.findOne({
        key: "id",
        equals: userId,
      });
      if (!userTestExist) {
        return fastify.httpErrors.notFound();
      }
      return fastify.db.posts.create({
        title,
        content,
        userId,
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
    async function (request, reply): Promise<PostEntity | HttpError> {
      if (!validator.isUUID(request.params.id)) {
        return fastify.httpErrors.badRequest();
      }
      const postTestExist = await fastify.db.posts.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!postTestExist) {
        return fastify.httpErrors.notFound();
      }
      return fastify.db.posts.delete(request.params.id);
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      return {} as PostEntity;
    }
  );
};

export default plugin;
