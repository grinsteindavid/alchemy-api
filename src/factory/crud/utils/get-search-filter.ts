import { isValidObjectId, Types, Schema } from 'mongoose';
import { Querystring } from './querystring-schema';
import { ENTITIES } from '../../../entities/types';
import { MongooseModelsDefinitions } from '../../../utils/mongoose';

export const getSearchFilter = ({
  filter,
  search,
  searchAttribute,
  searchType,
  entity,
}: {
  filter: Record<any, {}>;
  search: Querystring["search"];
  searchAttribute: Querystring["searchAttribute"];
  searchType: Querystring["searchType"],
  entity: `${ENTITIES}`;
}) => {
  const ModelDefinition = MongooseModelsDefinitions[entity]!;

  if (Boolean(searchAttribute) === false) return filter;
  if (ModelDefinition.path(searchAttribute) === undefined) return filter;

  let value;
  if (isValidObjectId(search) && ModelDefinition.path(searchAttribute) instanceof Schema.Types.ObjectId) {
    value = Types.ObjectId(search);
  } else if (isValidObjectId(search) && ModelDefinition.path(searchAttribute) instanceof Schema.Types.String) {
    value = search;
  } else if (ModelDefinition.path(searchAttribute) instanceof Schema.Types.Boolean) {
    value = search === 'true' || {$ne: true};
  } else if (searchType === 'regex') {
    value = new RegExp(
      search
        .replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')
        .split(/\s+/)
        .join('|'),
      'i',
    );
  } else {
    value = search;
  }

  return {
    ...filter,
    [`${searchAttribute}`]: value,
  };
};
