import { Querystring } from '../../../factory/crud/utils/querystring-schema';


export type IResponse = '400' | '401' | '404' | '412' | 'bulkWrite';

export type ICrudParams = keyof Querystring;

export type ISchema = 'User';
