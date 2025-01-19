import { Query, Document} from 'mongoose';

export const getDateRangeQuery = ({query, dateFrom, dateTo, dateField}: {query: Query<Document<any, any>[], Document<any, any>, {}>; dateFrom: Date; dateTo: Date; dateField: string}) => {
    return dateField && dateFrom && dateTo ? query.where({[`${dateField}`]: {$gte: dateFrom, $lte: dateTo}}) : query;
}