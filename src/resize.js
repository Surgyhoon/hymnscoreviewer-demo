function Resize(startCallback, endCallback) {
  //"use strict";

  var rtime;
  var timeout = false;
  var delta = 200;

  function resizeEnd() {
    timeout = window.clearTimeout(timeout);
    if (new Date() - rtime < delta) {
      timeout = setTimeout(resizeEnd, delta);
    } else {
      console.log("OK");
      endCallback();
    }
  }

  window.addEventListener("resize", function () {
    rtime = new Date();
    if (!timeout) {
      startCallback();
      rtime = new Date();
      timeout = window.setTimeout(resizeEnd, delta);
    }
  });

  window.setTimeout(startCallback, 0);
  window.setTimeout(endCallback, 1);
}
