// export function obj2qstr(obj) {
//     const keyValuePairs = [];
//     for (let i = 0; i < Object.keys(obj).length; i += 1) {
//       keyValuePairs.push(`${encodeURIComponent(Object.keys(obj)[i])}=${encodeURIComponent(Object.values(obj)[i])}`);
//     }
//     return keyValuePairs.join('&');
//   }

export function objarr2str(obj) {
    const keyValuePairs = [];
    for (let i = 0; i < Object.keys(obj).length; i += 1) {
      if (Object.values(obj)[i][1] != 0 || Object.values(obj)[i][1] != '') {
        keyValuePairs.push(`${encodeURIComponent(Object.keys(obj)[i])}=${encodeURIComponent(arr2str(Object.values(obj)[i]))}`);
      }
    }
    return keyValuePairs.join('&');
  }

export function obj2str(obj) {
    const keyValuePairs = [];
    for (let i = 0; i < obj.length; i += 1) {
      if (Object.values(obj[i])[0] != 0 || Object.values(obj[i])[0] != '') {
        keyValuePairs.push(`${encodeURIComponent(Object.keys(obj[i])[0])}=${encodeURIComponent(arr2str(Object.values(obj[i])[0]))}`);
      }
    }
    return keyValuePairs.join('&');
  }

export function arr2str(arr) {
    return arr.toString()
}

const ptype = {
  'BLOCKED' : 1 << 1,
  'FOLLOWER' : 1 << 2,
  'VOTER' : 1 << 3,
  'JURY' : 1 << 4,
  'CONTESTANT' : 1 << 5,
  'HOST' : 1<<6,
}

const aptype = ['BLOCKED', 'FOLLOWER', 'VOTER', 'JURY', 'CONTESTANT', 'HOST']

// input : a list of str which are types you want this user to be
// output : the value which should be stored in the db
export function participantTypeToValue() {
  let retval = 0
  for(let i = 0; i < arguments.length; i++) {
    // console.log(arguments[i])
    retval ^= ptype[arguments[i].toUpperCase()];
  }
  return retval
}

// input : the type value of participant from db
// output : a list of str which are types of this user
export function participantValueToType(value) {
  let retval = []
  for (let i = 0; i < 6; i++) {
    (value & 1<<(i+1)) && retval.push(aptype[i])
  }
  return retval
}

