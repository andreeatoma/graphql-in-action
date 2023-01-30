export const numbersInRangeObject = (begin, end) => {
  if (end < begin) {
    throw Error(`Invalid range because ${end} < ${begin}`);
  }
  let sum = 0;
  let count = 0;
  for (let i = begin; i <= end; i++) {
    sum += i;
    count++;
  }
  return { sum, count };
};

// The implementation of extractPrefixedColumns can be a simple reduce call to filter the columns and only include the prefixed columns, but without their prefixes.

export const extractPrefixedColumns = ({ prefixedObject, prefix }) => {
  const prefixRexp = new RegExp(`^${prefix}_(.*)`);
  return Object.entries(prefixedObject).reduce((acc, [key, value]) => {
    const match = key.match(prefixRexp);
    if (match) {
      acc[match[1]] = value;
    }
    return acc;
  }, {});
};

export const convertArrayToObjectById = (arr) => {
  return arr.reduce((acc, currentItem) => {
    acc[currentItem.id] = currentItem;

    return acc;
  }, {});
};

// for an array = [{id: '1', {id: '2'}}] the result would be {
//     "1": {
//         "id": "1"
//     },
//     "2": {
//         "id": "2"
//     },
//     "3": {
//         "id": "3"
//     }
// }
