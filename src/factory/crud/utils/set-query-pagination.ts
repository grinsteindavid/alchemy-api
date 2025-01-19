import { Document, Query } from 'mongoose';
export const setQueryPagination = ({
    page,
    pageSize,
    query,
    sortField,
    sortOrder,
  }: {
    query: Query<Document<any, any>[], Document<any, any>, {}>;
    pageSize: number;
    page: number;
    sortField: string[];
    sortOrder?: 'desc' | 'asc';
  }) => {
    const skip = typeof page === 'number' ? (page - 1) * pageSize : 0;
  
    return query
      .skip(skip)
      .limit(pageSize ? pageSize : (undefined as any))
      .sort(sortField ? sortField.reduce((acc, field) => ({ ...acc, [field]: (sortOrder || 'desc') === 'desc' ? -1 : 1 }), {}) : undefined);
  };
  