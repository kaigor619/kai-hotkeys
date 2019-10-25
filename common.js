// DocKeyDown.init();
// DocKeyDown.push_hotkeys(['xc', 'col', 'qwd'], function() {
//   text.innerHTML += 'Получилось!';
// });
// DocKeyDown.push_hotkeys(
//   ['ctrl+alt+x', 'er', 'ctrly', 'left-arrow+f'],
// function() {
//   text.innerHTML += 'Fuck!';
// },
// );

add_hotkeys(['ctrl+alt+x'], function() {
  text.innerHTML += 'Fuck!';
});
add_hotkeys('col', function() {
  text.innerHTML += 'Fuck!';
});
// del_hotkeys('ctrl+alt+x');
