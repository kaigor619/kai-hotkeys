// const DocKeyDown = {
// elem: document,
// obj_events: [],
// key_arr: [],
// presses: [],
// key_press: [],
// objkeys: {
//   ctrl: 17,
//   backspace: 8,
//   tab: 9,
//   enter: 13,
//   shift: 16,
//   alt: 18,
//   capslock: 20,
//   escape: 27,
//   'left-arrow': 37,
//   'up-arrow': 38,
//   'right-arrow': 39,
//   'down-arrow': 40,
//   delete: 46,
// },
// timer: setTimeout(function() {}, 0),
//   init: function() {
//     // document.addEventListener('DOMContentLoaded', function() {
//     this.events();
//     // });
//   },
//   push_hotkeys: function(str, func) {
// var arr;
// var mains_keys = this.objkeys;
// var async_mas = [];
// for (var i = 0; i < str.length; i++) {
//   if (str[i].indexOf('+') > -1) {
//     arr = str[i].split('+');
//     for (var a = 0; a < arr.length; a++) {
//       if (arr[a] in mains_keys) {
//         async_mas.push(mains_keys[arr[a]]);
//       } else {
//         async_mas.push(
//           String(arr[a])
//             .toUpperCase()
//             .charCodeAt(0),
//         );
//       }
//     }
//     var obj = {
//       name: async_mas,
//       func: func,
//     };
//     this.presses.push(obj);
//     async_mas = [];
//   } else {
//     if (str[i] in mains_keys) {
//       arr = [mains_keys[str[i]]];
//     } else {
//       arr = [str[i]];
//     }
//     var obj = {
//       name: arr,
//       func: func,
//     };
//     console.log(obj);
//     this.obj_events.push(obj);
//   }
// }

//     // console.log(this.presses);
//     // console.log(this.obj_events);
//   },
// del_event: function(str) {
//   for (var i = 0; i < this.obj_events.length; i++) {
//     for (var key in this.obj_events[i]) {
//       if (this.obj_events[i].name == str) {
//         this.obj_events.splice(i, 1);
//       }
//     }
//   }
// },
//   check_str: function() {
//     clearTimeout(this.timer);
//     var self = this;
//     this.timer = setTimeout(function() {
//       self.key_arr.splice(0, self.key_arr.length);
//     }, 2000);
//   },
//   events: function() {
//     var self = this;
//     var mains_keys = this.objkeys;
//     document.onkeydown = function(e) {
//       var key_arr = self.key_arr;

//       var val = String.fromCharCode(e.which);

//       val = val.toLowerCase();
//       var res;

//       var q = false;
//       for (var key in mains_keys) {
//         if (mains_keys[key] == e.which) {
//           res = mains_keys[key];
//           q = true;
//         }
//       }
//       if (q == true) {
//         key_arr.push(res);
//       } else key_arr.push(val);

//       var str = '';
//       for (var i = 0; i < key_arr.length; i++) {
//         str += key_arr[i];
//       }
//       var hotkeys = self.key_arr;
//       var custom_key = self.obj_events;

//       // Одновременная обработка клавиш
//       var presses = self.presses;
//       var key_press = self.key_press;
//       var length = key_press.length;
//       var m = 0;
//       var z = true;
//       if (key_press[length - 1] != e.which) {
//         key_press.push(e.which);
//         // console.log(key_press);
//         for (var i = 0; i < presses.length; i++) {
//           var mas = presses[i].name;
//           for (var c = 0; c < mas.length; c++) {
//             if (key_press[c] == mas[c]) {
//               m++;
//               z = false;
//             }
//           }
//           if (m == presses[i].name.length) {
//             presses[i].func();
//           }
//           if (z == false) break;
//         }
//       }
//       var z = true;
//       for (var i = 0; i < custom_key.length; i++) {
//         for (var x = 0; x < custom_key[i].name.length; x++) {
//           for (var q = 0; q < key_arr.length; q++) {
//             for (var key in mains_keys) {
//               // alert(custom_key[i].name[x]);
//               if (key_arr[q] == custom_key[i].name[x]) {
//                 // alert(custom_key[i].name[x]);
//                 custom_key[i].func();
//                 key_arr.splice(0, key_arr.length);
//                 z = false;
//                 break;
//               }
//             }
//             if (z == false) break;
//           }

//           if (z == false) break;
//           if (str.indexOf(custom_key[i].name[x]) > -1) {
//             custom_key[i].func();
//             key_arr.splice(0, key_arr.length);
//             z = false;
//             break;
//           }
//         }
//         if (z == false) break;
//       }
//       document.onkeyup = function() {
//         self.key_press = [];
//         input.value = str;
//         self.check_str();
//       };
//     };
//   },
// };

function isArray(value) {
  return typeof value == 'object' && value.constructor === Array;
}
function isNull(value) {
  return value === null;
}

let DataEvents = {
  elem: document,
  obj_events: [],
  key_arr: [],
  presses: [],
  key_press: [],
  timer: setTimeout(function() {}, 0),
};

const keydown_options = {
  connect: '+',
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

function filling_data(item, func) {
  let arr_connect;
  let async_mas = [];
  const { connect } = keydown_options;

  if (item.indexOf(connect) > -1) {
    arr_connect = item.split(connect);
    arr_connect.forEach(symbol => {
      let code = '';
      if (special_keys[symbol]) code = special_keys[symbol];
      else
        code = String(symbol)
          .toUpperCase()
          .charCodeAt(0);

      async_mas.push(code);
    });
    let obj = {
      name: async_mas,
      func,
    };
    DataEvents.presses.push(obj);
    async_mas = [];
  } else {
    if (special_keys[item]) {
      arr_connect = [special_keys[item]];
    } else {
      arr_connect = [item];
    }
    var obj = {
      name: arr_connect,
      func,
    };
    DataEvents.obj_events.push(obj);
  }
}

function add_hotkeys(keys, func) {
  if (isArray(keys))
    keys.forEach(item => {
      filling_data(item, func);
    });
  else if (typeof keys == 'string') filling_data(keys, func);

  console.log(DataEvents);
}

function del_hotkeys(str) {
  let i = null;
  // debugger;
  const { obj_events, presses } = DataEvents;
  const arr_search = [obj_events, presses];
  arr_search.forEach(mas => {
    if (mas.length > 0) {
      mas.forEach(({ name }, index) => {
        if (name == str) i = index;
      });
      if (!isNull(i)) mas.splice(i, 1);
    }
  });
}
