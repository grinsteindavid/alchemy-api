export const getSelectFiltered = (select: string, populate: string[]) => {
  return select
    ? select
        .split(' ')
        .filter((queryItem) => populate.some((docName) => queryItem.includes(`${docName}.`)) === false)
        .join(' ')
    : undefined;
};
