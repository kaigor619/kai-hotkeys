# kai-hotkeys

[![npm version](https://badge.fury.io/js/kai-hotkeys.svg)](https://badge.fury.io/js/piano-keys)
[![Build Status](https://travis-ci.org/dherault/kai-hotkeys.svg?branch=master)](https://travis-ci.org/dherault/piano-keys)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

Simple JavaScript shortcuts and hotkeys library.
This library has no dependencies and is very small in size (7 KB), compressed version - 4 KB. It is very easy to add, delete, change hotkeys or shortcuts.

## Installation

```
npm install kai-hotkeys --save
```

## Commands

hotkeys - is an object that has such methods:
add - add a hotkey
change - change a hotkey
delete - delete
is - check for the existence of hotkey
enable - enable work
disable - disable work

## Syntax

```shell
hotkeys.add(name, function, options);
hotkeys.change(name, name2, function2, options2);
hotkeys.delete(name);
hotkeys.is(name);
hotkeys.enable();
hotkeys.disable();
```

Arguments:

- name - hotkey name
- function - function to be executed
- name2 - changed name
- function2 - changed function
- options {
  pressingOnce:false, // allows when the user releases the key to repeat the operation by pressing back
  }

Recommendation: use {pressingOnce:true} when your function is alert, confirm or prompt.

## Usage

```js
import hotkeys from 'kai-hotkeys';

hotkeys.add('ctrl+alt+h', (event, handler) => console.log('ctrl+alt+h'));

hotkeys.add('1 2 3', (event, handler) => console.log('numbers'));

hotkeys.add(['z+x+c', 'ctrl+alt+x', 'c o d e'], (event, handler) =>
  console.log('multiply adding'),
);

// You can also enter the key code.
// ctrl+shift+v, t e s t
hotkeys.add(['{17}+{16}+v', 't {69} {83} t'], (event, handler) =>
  console.log('using keycodes'),
);

// Using options
hotkeys.add('shift+x', (event, handler) => alert('shift+x'), {
  pressingOnce: true, // false
});

// Changing name
hotkeys.change('ctrl+alt+h', 'ctrl+b');

// Changing name, function and options
hotkeys.change(
  'ctrl+alt+h',
  'ctrl+b',
  (event, handler) => console.log('change ctrl+alt+h => ctrl+b'),
  { pressingOnce: false },
);

// if you do not want to change any argument, insert - null
hotkeys.change('ctrl+alt+h', null, null, { pressingOnce: false });

// Deleting hotkey
hotkeys.delete('1 2 3');

hotkeys.delete(['1 2 3', 'ctrl+b', '{17}+{16}+v']);

// Enable all hotkeys
hotkeys.enable();

// Disable all hotkeys
hotkeys.disable();
```

## Api

hotkeys.api has such methods:

- getHotkeys() - return all hotkeys
- getSpecialKeys() - return list of special keys
- getVisibleState() - return state of work (on/false)
- getIndex(name) - return index found name

## Browser Support

Kai-hotkeys has been tested and should work in.

```shell
Firefox
Chrome
Opera
Edge
```

## Supported Keys

The following special keys can be used for shortcuts: ctrl, backspace, tab, enter, shift, alt, capslock, escape, left, up, right, down, delete.

## Contributing

Any PR is welcome and will be reviewed.

## License

MIT
