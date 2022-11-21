export const objectReject = (obj: Record<string, any>, predicate: (key: string, value: any) => boolean): Record<string, any> => {
  const object = { ...obj };
  Object.keys(object).forEach((key) => {
    if (predicate(key, object[key])) {
      delete object[key];
    }
  });

  return object;
};

const a = { a: undefined, b: 1 }
objectReject(a, (_, v) => v === undefined || v === null);
