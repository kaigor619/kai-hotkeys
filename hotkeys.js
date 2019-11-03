function isArray(value) {
  return typeof value == 'object' && value.constructor === Array;
}
function isNull(value) {
  return value === null;
}
function isNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}
function isString(value) {
  return typeof value == 'string';
}
let DataEvents = {
  keys_rotation: [],
  keys_together: [] /* "Одновременно" */,
  all_keys: [] /* Массив всех клавиш */,
  key_rot: [],
  key_tog: [],
  timer: setTimeout(function() {}, 0),
};

const keydown_options = {
  together: '+',
  rotation: '-',
};

const special_keys = {
  ctrl: 17,
  backspace: 8,
  tab: 9,
  enter: 13,
  shift: 16,
  alt: 18,
  capslock: 20,
  escape: 27,
  'left-arrow': 37,
  'up-arrow': 38,
  'right-arrow': 39,
  'down-arrow': 40,

  delete: 46,
};

// Проверка строки и возрат массива чисел
function process_str(item, connection, arr_result) {
  item_symbols = item.split(connection);
  arr_keys = item_symbols.map(symbol => {
    let code = 0;
    if (special_keys[symbol]) code = special_keys[symbol];
    else if (/\{[0-9]*\}/.test(symbol)) {
      code = +symbol.replace(/(^{*)|(}*)$/g, '');
    } else code = symbol.toUpperCase().charCodeAt(0);

    return code;
  });
  return arr_keys;
}

function check_data(item) {
  const { together, rotation } = keydown_options;
  let curr_type = '';
  let arr_keys = [];
  if (item.indexOf(together) > -1) {
    arr_keys = process_str(item, together);
    curr_type = 'keys_together';
  } else if (item.indexOf(rotation) > -1) {
    arr_keys = process_str(item, rotation);
    curr_type = 'keys_rotation';
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
}

// заполнение данными о keyCode
function filling_data(item, func) {
  const { together, rotation } = keydown_options;
  const { length } = DataEvents.all_keys;

  const { arr_keys, curr_type } = check_data(item);

  let obj_allkeys = {
    codes: arr_keys,
    name: item,
    func,
    curr_type,
  };
  let obj_rot = {
    codes: arr_keys,
    func_index: length,
  };
  if (curr_type !== '') {
    DataEvents[curr_type].push(obj_rot);
    DataEvents.all_keys.push(obj_allkeys);
  }
}

function add_hotkeys(keys, func) {
  if (isArray(keys))
    keys.forEach(item => {
      filling_data(item, func);
    });
  else if (typeof keys == 'string') filling_data(keys, func);

  eventKeyDown();
}

function eventKeyDown() {
  var self = this;
  let { key_rot, key_tog, keys_together, keys_rotation, all_keys } = DataEvents;

  document.onkeydown = function(e) {
    let code_num = e.which;
    let { length } = key_tog;
    key_rot.push(code_num);

    function run_arr(arr, curr_arr) {
      let { key_rot, key_tog } = DataEvents;
      arr.forEach(({ codes, func_index }, i) => {
        let bool_equal = codes.every((item, index) => item == curr_arr[index]);
        if (bool_equal) {
          all_keys[func_index].func();
          key_rot.splice(0, key_rot.length);
          // key_tog.splice(0, key_tog.length);
          return;
        }
      });
    }

    // keys_together
    if (key_tog[length - 1] != code_num) {
      key_tog.push(code_num);
      run_arr(keys_together, key_tog);
    }

    // keys_rotation
    run_arr(keys_rotation, key_rot);
  };
  document.onkeyup = function(e) {
    let last = key_tog.length - 1;

    if (last !== -1 && key_tog[last] == e.keyCode) {
      key_tog.pop();
    } else key_tog = [];

    check_key();
  };
}

function check_key() {
  let { key_rot } = DataEvents;
  clearTimeout(DataEvents.timer);
  DataEvents.timer = setTimeout(function() {
    key_rot.splice(0, key_rot.length);
  }, 1000);
}

function del_hotkeys(data) {
  function del_all_keys(item) {
    let { all_keys, keys_rotation, keys_together } = DataEvents;
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
}

function update_hotkeys() {
  let { all_keys, keys_rotation, keys_together } = DataEvents;

  keys_rotation.splice(0, keys_rotation.length);
  keys_together.splice(0, keys_together.length);

  all_keys.forEach(({ codes, curr_type }, index) => {
    DataEvents[curr_type].push({ codes, func_index: index });
  });
}

function change_name_hotkeys(str, newStr) {
  let { all_keys } = DataEvents;
  let i = -1;
  if (str !== newStr) {
    all_keys.forEach(({ codes, name }, index) => {
      if (str == name) {
        i = index;
      }
    });
    if (i !== -1) {
      const { arr_keys, curr_type } = check_data(newStr);
      if (curr_type !== '') {
        all_keys[i].name = newStr;
        all_keys[i].codes = arr_keys;
        if (arguments[2] !== undefined && typeof arguments[2] == 'function') {
          all_keys[i].func = arguments[2];
        }
        update_hotkeys();
      }
    }
  }
}
