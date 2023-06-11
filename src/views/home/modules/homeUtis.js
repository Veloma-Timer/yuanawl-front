export const setValues = (obj, key) => {
  return Object.values(obj).map(item => {
    return item[key];
  });
};
