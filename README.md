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

// pressingOnce:true - allows you to press the keys again each time;
// pressingOnce:false - allows when the user releases the key to repeat the operation by pressing back;
// Recommendation: use {pressingOnce:true} when your function is alert, confirm or prompt.
hotkeys.add('shift+x', (event, handler) => alert('shift+x'), {
  pressingOnce: true, // false
});

// You can change hotkey
hotkeys.change('ctrl+alt+h', 'ctrl+b');

// You can change the hotkey, its function and options
hotkeys.change(
  'ctrl+alt+h',
  'ctrl+b',
  (event, handler) => console.log('change ctrl+alt+h => ctrl+b'),
  { pressingOnce: false },
);

// if you do not want to change any argument, insert - null
hotkeys.change('ctrl+alt+h', null, null, { pressingOnce: false });

// You can delete hotkey
hotkeys.delete('1 2 3');

hotkeys.delete(['1 2 3', 'ctrl+b', '{17}+{16}+v']);

// Enable all hotkeys
hotkeys.enable();

// Disable all hotkeys
hotkeys.disable();
```

## Browser Support

Kai-hotkeys has been tested and should work in.

```shell
Firefox
Chrome
```

## Supported Keys

The following special keys can be used for shortcuts: ctrl, backspace, tab, enter, shift, alt, capslock, escape, left, up, right, down, delete.

## Contributing

Any PR is welcome and will be reviewed.

## License

MIT
