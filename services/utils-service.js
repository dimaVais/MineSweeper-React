export const utilService = {
  makeId,
  printTime,
  getRandomInt,
  getRandomColor
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomInt(min, max) {
  var randomNumber = Math.floor(Math.random() * (max - min) + min);
  return randomNumber;
}

function printTime(time) {
  var secs = Math.floor(time / 1000);
  var timeFormat = '';
  if (secs < 60) {
      timeFormat = '0:00:';
      if (secs < 10) timeFormat = '0:00:0';
      timeFormat += secs;
  }
  else {
      if (secs / 60 >= 1) {
          var minutes = Math.floor(secs / 60);
          if (minutes < 10) minutes = '0' + minutes;
          var seconds = Math.floor((secs % 60));
          if (seconds < 10) seconds = '0' + seconds;
          timeFormat = '0:' + minutes + ':' + seconds;
      }
      if (secs / 60 ** 2 > 1) {
          var hours = Math.floor(secs / 60 ** 2);
          timeFormat = hours + timeFormat
      }
  }
  return timeFormat;
}

function makeId(length = 5) {
  var txt = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

