export function obj2qstr(obj) {
    const keyValuePairs = [];
    for (let i = 0; i < Object.keys(obj).length; i += 1) {
      keyValuePairs.push(`${encodeURIComponent(Object.keys(obj)[i])}=${encodeURIComponent(Object.values(obj)[i])}`);
    }
    return keyValuePairs.join('&');
  }

export function objarr2str(obj) {
    const keyValuePairs = [];
    for (let i = 0; i < Object.keys(obj).length; i += 1) {
      if (Object.values(obj)[i][1] != 0 || Object.values(obj)[i][1] != '') {
        keyValuePairs.push(`${encodeURIComponent(Object.keys(obj)[i])}=${encodeURIComponent(arr2str(Object.values(obj)[i]))}`);
      }
    }
    return keyValuePairs.join('&');
  }

export function arr2str(arr) {
    return arr.toString()
}

