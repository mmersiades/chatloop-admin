export const replaceEmptyString = <T>(object: T): T => {
  const entries = Object.entries(object);
  const modifiedEntries = entries.map((keyValuePair) => {
    if (keyValuePair[1] === '') {
      keyValuePair[1] = null;
    }
    return keyValuePair;
  });
  return Object.fromEntries(modifiedEntries) as T;
};
