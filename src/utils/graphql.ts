import _, { first } from 'lodash';
import { composeMongoose } from 'graphql-compose-mongoose';
import { SchemaComposer } from 'graphql-compose';
import { getModel, MongooseModelsDefinitions } from './mongoose';

export const generateGraphqlEntitySchemas = () => {
  const graphqlSchemas = Object.fromEntries(
    Object.entries(MongooseModelsDefinitions).map(([modelName, schema]) => [
      modelName,
      composeMongoose(getModel(modelName as keyof typeof MongooseModelsDefinitions, schema)),
    ]),
  );

  Object.entries(graphqlSchemas).forEach(([modelName, graphqlSchema]) => {
    const schema = MongooseModelsDefinitions[modelName as keyof typeof MongooseModelsDefinitions]!;
    Object.entries(schema.paths).forEach(([field, fieldDefinition]) => {
      const options = (fieldDefinition as unknown as { options: { ref: string; type: { ref: string }[] } }).options;
      const ref = options?.ref || first(options?.type)?.ref;
      const relatedSchema = graphqlSchemas[ref!];

      if (relatedSchema) {
        const isRefArray = Array.isArray(options?.type) && options.type[0]?.ref;
        graphqlSchema.addRelation(field.replace(/\./g, '_'), {
          resolver: (isRefArray
            ? relatedSchema.mongooseResolvers.dataLoaderMany()
            : relatedSchema.mongooseResolvers.dataLoader()) as any,
          prepareArgs: {
            [isRefArray ? '_ids' : '_id']: (source: any) => source.get(field),
          },
          projection: { [field]: true },
        });
      }
    });
  });

  return graphqlSchemas;
};

export const generateGraphqlEntityQueryFields = () => {
  const schemaComposer = new SchemaComposer();
  const graphqlEntitySchemas = generateGraphqlEntitySchemas();

  (Object.keys(graphqlEntitySchemas) as Array<keyof typeof MongooseModelsDefinitions>).forEach((modelName) => {
    schemaComposer.Query.addFields({
      [`${modelName}FindById`]: graphqlEntitySchemas[modelName]!.mongooseResolvers.findById(),
      [`${modelName}FindByIds`]: graphqlEntitySchemas[modelName]!.mongooseResolvers.findByIds(),
      [`${modelName}FindOne`]: graphqlEntitySchemas[modelName]!.mongooseResolvers.findOne({
        filter: { operators: true },
      }),
      [`${modelName}FindMany`]: graphqlEntitySchemas[modelName]!.mongooseResolvers.findMany({
        filter: { operators: true },
      }),
      [`${modelName}DataLoader`]: graphqlEntitySchemas[modelName]!.mongooseResolvers.dataLoader(),
      [`${modelName}DataLoaderMany`]: graphqlEntitySchemas[modelName]!.mongooseResolvers.dataLoaderMany(),
      [`${modelName}Count`]: graphqlEntitySchemas[modelName]!.mongooseResolvers.count({
        filter: { operators: true },
      }),
      [`${modelName}Pagination`]: graphqlEntitySchemas[modelName]!.mongooseResolvers.pagination({
        //@ts-ignore
        filter: { operators: true },
      }),
    });
  });

  return schemaComposer.buildSchema();
};
