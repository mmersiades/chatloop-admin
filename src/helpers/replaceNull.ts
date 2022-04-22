export const replaceNull = <T>(object: T): T => {
  const entries = Object.entries(object);
  const modifiedEntries = entries.map((keyValuePair) => {
    if (keyValuePair[1] === null) {
      keyValuePair[1] = '';
    }
    return keyValuePair;
  });
  return Object.fromEntries(modifiedEntries) as T;
};
