// ctrl+alt+x- 17 18 88
// shift+c= 16 67
add_hotkeys(['ctrl+alt+x', 'c-o-l', 'shift+alt+b'], function(event, handler) {
  text.innerHTML += ' Fuck!';
  console.log(handler);
});
add_hotkeys(['shift+z'], function(event, handler) {
  text.innerHTML += ' Yee!';
  // console.log(handler);
});
add_hotkeys(['shift-d'], function(event, handler) {
  text.innerHTML += ' Yee!';
  // console.log(handler);
});

// change_name_hotkeys('ctrl+alt+x', 'shift+c', function() {
//   text.innerHTML += 'Change!';
// });
// del_hotkeys(['ctrl-k-l', 'z-x-c']);
