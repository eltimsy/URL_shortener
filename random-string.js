'use strict';

module.exports = function generateRandomString(number) {
  let randomString = "";
  for(var i = 0; i < number; i++){
    randomString += Math.floor(Math.random()*36).toString(36);
  }
  return randomString;
}
