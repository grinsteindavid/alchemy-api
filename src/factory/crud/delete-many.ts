import { Document } from 'mongoose';
import Joi from 'joi';
import { THooks } from './utils/hooks-type';
import { makeFastifyRoute, RouteMethod } from '../../utils/fastify';
import { ENTITIES } from '../../entities/types';
import { getModel, MongooseModelsDefinitions } from '../../utils/mongoose';
import { validateJoiSchema } from '../../utils/validate-joi-schema';
import { CheckPermissions } from '../../utils/check-permission';
import { Querystring } from './utils/querystring-schema';
import { preHandlerDefaults } from './utils/pre-handler-defaults';

export const deleteMany = ({
    path,
    entity,
    permissions = [],
    hooks = { onSend: [], preHandler: [] },
}: {
    path: string;
    entity: `${ENTITIES}`;
    permissions?: string[];
    hooks?: THooks;
}) =>
    makeFastifyRoute(
        RouteMethod.DELETE,
        path,
        async (request, reply) => {
            const { query } = request as {
                query: Querystring;
            };

            const model = getModel<Document>(entity, MongooseModelsDefinitions[entity]!);
            const response = await model.updateMany(
                { _id: { $in: query.ids } },
                { $set: { deleted: true } }
            );
            return reply.status(201).send(response);
        },
        {
            preValidation: [
                CheckPermissions(permissions),
                preHandlerDefaults,
                validateJoiSchema(
                    Joi.object<Querystring>().keys({
                        ids: Joi.array().items(Joi.string().alphanum().length(24)).min(1).max(100)
                    }),
                    'query'
                ),
            ],
            preHandler: [...(hooks.preHandler || [])],
            onSend: [...(hooks.onSend || [])],
        },
    );
