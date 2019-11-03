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
  keys_rotation: [] /* "По очереди" */,
  keys_together: [] /* "Одновременно" */,
  all_keys: [] /* Массив всех клавиш */,
  key_rot: [],
  key_tog: [],

  timer: setTimeout(function() {}, 0),
  count: 0,
};

const keydown_options = {
  together: '+',
  rotation: '-',
};

// Проверка внутренней строки и возрат массива чисел keyCodes
function check_internal_str(item, connection) {
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

// Общая проверка строки
function check_hotkeys_str(item) {
  const { together, rotation } = keydown_options;
  let curr_type = '';
  let arr_keys = [];
  if (item.indexOf(together) > -1) {
    arr_keys = check_internal_str(item, together);
    curr_type = 'keys_together';
  } else if (item.indexOf(rotation) > -1) {
    arr_keys = check_internal_str(item, rotation);
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

// заполнение данных в DataEvents
function filling_data(item, func) {
  const { length } = DataEvents.all_keys;
  const { arr_keys, curr_type } = check_hotkeys_str(item);

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

// Добавление новой гарячей клавиши
function add_hotkeys(keys, func) {
  DataEvents.count += 1;
  if (isArray(keys))
    keys.forEach(item => {
      filling_data(item, func);
    });
  else if (typeof keys == 'string') filling_data(keys, func);

  if (DataEvents.count == 1) eventKeyDown();
}

// Обработка событий onkeydown and onkeyup
function eventKeyDown() {
  var self = this;
  let { key_rot, key_tog, keys_together, keys_rotation, all_keys } = DataEvents;

  document.onkeydown = function(e) {
    let code_num = e.which;
    let { length } = key_tog;
    key_rot.push(code_num);

    const run_arr = (arr, curr_arr) => {
      let { key_rot, key_tog, all_keys } = DataEvents;
      arr.forEach(({ codes, func_index }, i) => {
        let bool_equal = codes.every((item, index) => item == curr_arr[index]);
        if (bool_equal) {
          let { name } = all_keys[func_index];
          all_keys[func_index].func.apply(this, [e, { name, codes }]);
          key_rot.splice(0, key_rot.length);
          return;
        }
      });
    };

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

    smart_clean_rot();
  };
}

// Очистка key_rot через таймер
function smart_clean_rot() {
  let { key_rot } = DataEvents;
  clearTimeout(DataEvents.timer);
  DataEvents.timer = setTimeout(function() {
    key_rot.splice(0, key_rot.length);
  }, 1000);
}

// Удаление гарячей клавиши через строку, переданнную как аргумент
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

// Сиххронизация keys_rotation, keys_together из all_keys
function update_hotkeys() {
  let { all_keys, keys_rotation, keys_together } = DataEvents;

  keys_rotation.splice(0, keys_rotation.length);
  keys_together.splice(0, keys_together.length);

  all_keys.forEach(({ codes, curr_type }, index) => {
    DataEvents[curr_type].push({ codes, func_index: index });
  });
}

// Изменение имени гарячей клавиши и ее функции
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
      const { arr_keys, curr_type } = check_hotkeys_str(newStr);
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
