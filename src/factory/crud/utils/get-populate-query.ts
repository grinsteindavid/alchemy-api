export const getPopulateQuery = (docName: string, select: string) => {
  return {
    path: docName,
    select: select ? select
      .split(' ')
      .filter((item) => item.includes(`${docName}.`))
      .map((item) => item.replace(`${docName}.`, ''))
      .join(' ') : undefined
  };
};
