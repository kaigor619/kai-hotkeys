hotkeys.add('ctrl+alt+k', (event, handler) => console.log('ctrl+alt+k'));

hotkeys.add('1 2 3', (event, handler) => console.log('1 2 3'));

hotkeys.add(['z+x+c', 'ctrl+alt+x', 'c o d e'], (event, handler) =>
  console.log('name: ' + handler.name + '\ncodes: ' + handler.codes.join(',')),
);

// ctrl+shift+v, t e s t
hotkeys.add(
  ['{17}+{16}+v', 't {69} {83} t'],
  (event, handler) => alert(handler.name),
  { pressingOnce: true },
);
