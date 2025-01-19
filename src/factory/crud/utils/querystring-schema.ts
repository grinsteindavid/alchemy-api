import Joi from 'joi';

export type Querystring = {
  page: number;
  pageSize: number;
  sortField: string[];
  sortOrder: 'desc' | 'asc';
  select: string;
  search: string;
  ids: string[];
  searchAttribute: string;
  searchType: 'strict' | 'regex';
  populate: string[];
  dateFrom: Date;
  dateTo: Date;
  dateField: string;
};

export const querystringSchema = {
  page: Joi.number().min(1),
  pageSize: Joi.number().min(1).max(500),
  sortField: Joi.array().items(Joi.string().min(1)),
  sortOrder: Joi.string().valid('desc', 'asc'),
  select: Joi.string().min(1),
  search: Joi.string().min(1).max(255).when('searchAttribute', {
    is: Joi.exist(),
    then: Joi.required()
  }),
  ids: Joi.array().items(Joi.string().min(1)),
  searchAttribute: Joi.string().min(1),
  searchType: Joi.string().valid('strict', 'regex'),
  populate: Joi.array().items(Joi.string().min(1)),
  dateFrom: Joi.date().when('dateField', {
    is: Joi.exist(),
    then: Joi.required()
  }),
  dateTo: Joi.date().when('dateField', {
    is: Joi.exist(),
    then: Joi.required()
  }),
  dateField: Joi.string()
};
