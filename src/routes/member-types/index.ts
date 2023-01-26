import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { changeMemberTypeBodySchema } from "./schema";
import type { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";
import { HttpError } from "@fastify/sensible/lib/httpError";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return fastify.db.memberTypes.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity | HttpError> {
      const memberTypeId = await fastify.db.memberTypes.findOne({
        key: "id",
        equals: request.params.id,
      });
      return memberTypeId ? memberTypeId : fastify.httpErrors.notFound();
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity | HttpError> {
      const memberTypeId = await fastify.db.memberTypes.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!memberTypeId) {
        return fastify.httpErrors.badRequest();
      }
      const {
        discount = memberTypeId.discount,
        monthPostsLimit = memberTypeId.monthPostsLimit,
      } = request.body;
      return fastify.db.memberTypes.change(request.params.id, {
        discount,
        monthPostsLimit,
      });
    }
  );
};

export default plugin;
