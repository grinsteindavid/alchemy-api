import { OpenAPIV3 } from 'openapi-types';
import { ICrudParams } from '../types';

export const crudFactoryParameters: Record<ICrudParams, OpenAPIV3.ParameterObject> = {
  page: {
    name: 'page',
    in: 'query',
    required: false,
    schema: {
      type: 'integer',
      minimum: 1,
    },
  },
  pageSize: {
    name: 'pageSize',
    in: 'query',
    required: false,
    schema: {
      type: 'integer',
      minimum: 1,
      maximum: 500,
    },
  },
  sortField: {
    name: 'sortField[]',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      minLength: 1,
    },
  },
  sortOrder: {
    name: 'sortOrder',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      enum: ['desc', 'asc'],
    },
  },
  select: {
    name: 'select',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      minLength: 1,
    },
  },
  search: {
    name: 'search',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      minLength: 1,
    },
  },
  searchAttribute: {
    name: 'searchAttribute',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      minLength: 1,
    },
  },
  searchType: {
    name: 'searchType',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      enum: ['strict', 'regex'],
    },
  },
  ids: {
    name: 'ids',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      minLength: 1,
    },
  },
  populate: {
    name: 'populate[]',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      minLength: 1,
    },
  },
  dateFrom: {
    name: 'dateFrom',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      format: 'date-time',
    },
  },
  dateTo: {
    name: 'dateTo',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      format: 'date-time',
    },
  },
  dateField: {
    name: 'dateField',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      minLength: 1,
    },
  },
};
