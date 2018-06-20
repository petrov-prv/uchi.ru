"use strict";
/* global Task, View, Controller */

(function () {
  window.onload = function () {
    let task = new Task;
    let view = new View(task);
    let controller = new Controller(view, task);
    view.init();
    controller.run();
  }
})();