'use strict'; // Data Type Check

function isArray(value) {
  return typeof value == 'object' && value.constructor === Array;
}

function isString(value) {
  return typeof value == 'string';
} // Special keys

var special_keys = {
  ctrl: 17,
  backspace: 8,
  tab: 9,
  enter: 13,
  shift: 16,
  alt: 18,
  capslock: 20,
  escape: 27,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  delete: 46,
}; // Default options

const default_options = {
  pressingOnce: false,
}; // Separator of together or rotation keys

const keydown_options = {
  together: '+',
  rotation: ' ',
}; // Main object

let hotkeys_data = {
  keys_rotation: [],
  keys_together: [],
  all_keys: [],
  key_rot: [],
  key_tog: [],
  timer: setTimeout(function() {}, 0),
  count: 0,
  on: true,
}; // Checking the inner string and returning an array

function check_internal_str(item, connection) {
  let item_symbols = [];

  try {
    item_symbols = item.split(connection);
  } catch (error) {
    throw new Error('Invalid keys description ' + error);
  }

  let arr_keys = item_symbols.map(symbol => {
    let code = 0;
    if (special_keys[symbol]) code = special_keys[symbol];
    else if (/\{[0-9]*\}/.test(symbol)) {
      code = +symbol.replace(/(^{*)|(}*)$/g, '');
    } else code = symbol.toUpperCase().charCodeAt(0);
    return code;
  });
  return arr_keys;
} // General line check

function check_hotkeys_str(item) {
  const { together, rotation } = keydown_options;
  let curr_type = '';
  let arr_keys = [];
  const tog_pattern = /([^ +]+\+)+[^ +]+/;
  const rot_pattern = /([^ ]+ )+[^ ]+/;

  if (tog_pattern.test(item)) {
    if (tog_pattern.exec(item)[0].length == item.length) {
      arr_keys = check_internal_str(item, together);
      curr_type = 'keys_together';
    }
  }

  if (rot_pattern.test(item)) {
    if (rot_pattern.exec(item)[0].length == item.length) {
      arr_keys = check_internal_str(item, rotation);
      curr_type = 'keys_rotation';
    }
  } else {
    if (special_keys[item]) {
      arr_keys = [special_keys[item]];
      curr_type = 'keys_together';
    } else if (item.length == 1) {
      arr_keys = [
        String(item)
          .toUpperCase()
          .charCodeAt(0),
      ];
      curr_type = 'keys_together';
    }
  }

  return {
    arr_keys,
    curr_type,
  };
} // fill data in hotkeys

function filling_data(item, func) {
  const { length } = hotkeys_data.all_keys; // Check options

  let options;

  if (typeof arguments[2] == 'object') {
    options = arguments[2];
    let keys = Object.keys(options);
    let bool = keys.some(item => !(item in default_options));

    if (!bool) {
      options = { ...default_options, ...options };
    }
  } else {
    options = Object.assign({}, default_options);
  } // Is there such a hotkey?

  if (!hotkeys.is(item)) {
    const { arr_keys, curr_type } = check_hotkeys_str(item);
    let obj_allkeys = {
      codes: arr_keys,
      name: item,
      func,
      curr_type,
      options,
    };
    let obj_rot = {
      codes: arr_keys,
      func_index: length,
    };

    if (curr_type !== '') {
      hotkeys_data[curr_type].push(obj_rot);
      hotkeys_data.all_keys.push(obj_allkeys);
    }
  } else {
    let ind = getIndex(item);
    hotkeys_data.all_keys[ind].func = func;
    hotkeys_data.all_keys[ind].name = item;
    hotkeys_data.all_keys[ind].options = options;
  }
} // Handling onkeydown and onkeyup events

function eventKey() {
  let { key_rot, key_tog, keys_together, keys_rotation } = hotkeys_data;

  document.onkeydown = function(e) {
    let { on, all_keys } = hotkeys_data;
    if (!on) return;
    let code_num = e.which;
    key_rot.push(code_num);
    if (key_tog[key_tog.length - 1] !== code_num) key_tog.push(code_num);

    function run_arr(arr, curr_arr) {
      let { key_rot } = hotkeys_data;
      let res_ind = -1;
      arr.forEach(({ codes, func_index }) => {
        let bool = codes.every((item, index) => item == curr_arr[index]);

        if (bool) {
          key_rot.splice(0, key_rot.length);
          res_ind = func_index;
        }
      });
      return res_ind;
    }

    let promise = new Promise(function(resolve) {
      let tog_ind = run_arr(keys_together, key_tog);
      let rot_ind = run_arr(keys_rotation, key_rot);
      let ind = tog_ind !== -1 ? tog_ind : rot_ind;
      resolve(ind);
    });
    promise.then(result => {
      if (result !== -1) {
        let { name, codes, options } = all_keys[result];

        if (options.pressingOnce) {
          key_tog = [];
          smart_clean_rot();
        }

        all_keys[result].func.apply(this, [
          e,
          {
            name,
            codes,
          },
        ]);
      }
    });
  };

  document.onkeyup = function(e) {
    let { on } = hotkeys_data;
    if (!on) return;
    let last = key_tog.length - 1;

    if (last !== -1 && key_tog[last] == e.keyCode) {
      key_tog.pop();
    } else key_tog = [];

    smart_clean_rot();
  };
} // Clearing key_rot via a timer

function smart_clean_rot() {
  let { key_rot } = hotkeys_data;
  clearTimeout(hotkeys_data.timer);
  hotkeys_data.timer = setTimeout(function() {
    key_rot.splice(0, key_rot.length);
  }, 1000);
} // Synchronization keys_rotation, keys_together from all_keys

function update_hotkeys() {
  let { all_keys, keys_rotation, keys_together } = hotkeys_data;
  keys_rotation.splice(0, keys_rotation.length);
  keys_together.splice(0, keys_together.length);
  all_keys.forEach(({ codes, curr_type }, index) => {
    hotkeys_data[curr_type].push({
      codes,
      func_index: index,
    });
  });
}

function getIndex(str) {
  if (hotkeys.is(str)) {
    const { all_keys } = hotkeys_data;
    let index = all_keys.findIndex(({ name }) => name == str);

    if (index == -1) {
      const { arr_keys } = check_hotkeys_str(str);
      let bool = hotkeys_data.all_keys.some(({ codes }, i) => {
        let b = codes.every((item, index) => item == arr_keys[index]);
        if (b) index = i;
        return b;
      });
    }

    return index;
  }

  return -1;
}

const hotkeys = {
  api: {
    getHotkeys: () => hotkeys_data.all_keys,
    getSpecialKeys: () => special_keys,
    getVisibleState: () => hotkeys_data.on,
    getIndex,
  },
  // Add a new hotkey
  add: function(keys, func) {
    hotkeys_data.count += 1;
    if (isArray(keys))
      keys.forEach(item => {
        filling_data(item, func, arguments[2]);
      });
    else if (typeof keys == 'string') filling_data(keys, func, arguments[2]);
    if (hotkeys_data.count == 1) eventKey();
  },
  // Delete hotkey
  delete: function(data) {
    function del_all_keys(item) {
      let { all_keys } = hotkeys_data;
      let i = -1;
      all_keys.forEach(({ name }, index) => {
        if (name == item) i = index;
      });

      if (i !== -1) {
        all_keys.splice(i, 1);
        update_hotkeys();
      }
    }

    if (isArray(data)) {
      data.forEach(del_all_keys);
    } else if (isString(data)) del_all_keys(data);
  },
  // Change name and function of hotkey
  change: function(str, newStr) {
    let { all_keys } = hotkeys_data;
    let i = -1;
    all_keys.forEach(({ name }, index) => {
      if (str == name) {
        i = index;
      }
    });

    if (i !== -1) {
      if (newStr !== null) {
        const { arr_keys, curr_type } = check_hotkeys_str(newStr);

        if (curr_type !== '') {
          all_keys[i].name = newStr;
          all_keys[i].codes = arr_keys;
        }
      }

      if (
        arguments[2] !== undefined &&
        typeof arguments[2] == 'function' &&
        arguments[2] !== null
      ) {
        all_keys[i].func = arguments[2];
      }

      if (
        arguments[3] !== undefined &&
        typeof arguments[3] == 'object' &&
        arguments[3] !== null
      ) {
        all_keys[i].options = arguments[3];
      }

      update_hotkeys();
    }
  },

  is(str) {
    const { all_keys } = hotkeys_data;
    let bool = all_keys.some(({ name }) => name == str);

    if (!bool) {
      const { arr_keys } = check_hotkeys_str(str);
      bool = hotkeys_data.all_keys.some(({ codes }) =>
        codes.every((item, index) => item == arr_keys[index]),
      );
    }

    return bool;
  },

  // enable
  enable: function() {
    hotkeys_data.on = true;
  },
  // disable
  disable: function() {
    hotkeys_data.on = false;
  },
};
