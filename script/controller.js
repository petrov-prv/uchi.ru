"use strict";

/* exported Controller */

/**
 * Контроллер
 * @constructor
 * @param {Object} view - объект для отображения поля задачи
 * @param {Object} task - объект задачи
 */
function Controller(view, task) {

  var currentView = view;
  var checkValue;
  var current;
  var nextStage, nextStageTimeout;

  /**
   * Отрисовывает уравнение и запускает решение.
   */
  this.run = function () {
    currentView.drawTask();
    nextStageTimeout = 500;
    setTimeout(stage1, nextStageTimeout);
  };

  /**
   * В инпуте допустимы только цифры
   * @param {*} evt - событие типа KeyboardEvent
   */
  function onKeyPress(evt) {
    return evt.charCode === 0 || /\d/.test(String.fromCharCode(evt.charCode));
  }

  /**
   * Обработчик ввода. Проверяет значение, введенное в поле. При необходимости устанавливает цвет текста в инпуте и подсветку текущего операнда в уравнении.
   */
  function onInput() {
    if (parseInt(this.value) === checkValue) {
      this.parentNode.removeChild(this);
      currentView.drawTask();
      if (nextStage) {
        if (nextStageTimeout === 0) nextStage();
        else setTimeout(nextStage, nextStageTimeout);
      }
    } else if (this.value === "") {
      this.style.color = "black";
      currentView.drawTask();
    } else {
      this.style.color = "red";
      currentView.drawTask({
        mark: current
      });
    }
  }

  /**
   * Поле ввода над первой стрелкой, ввод первого операнда. При выполнении переход к следующему этапу.
   */
  function stage1() {
    currentView.drawArrow(1);
    var input = currentView.drawInput(1);
    input.onkeypress = onKeyPress;
    input.oninput = onInput;
    input.focus();
    checkValue = task.a;
    current = 1;
    nextStage = stage2;
  }

  /**
   * Поле ввода над второй стрелкой, ввод второго операнда. При выполнении переход к следующему этапу.
   */
  function stage2() {
    currentView.drawArrow(2);
    var input = currentView.drawInput(2);
    input.onkeypress = onKeyPress;
    input.oninput = onInput;
    input.focus();
    checkValue = task.b;
    current = 2;
    nextStage = stage3;
  }

  /**
   * Поле ввода на результате уравнения, ввод результата. При выполнении переход к следующему этапу.
   */
  function stage3() {
    var input = currentView.drawResultInput();
    input.onkeypress = onKeyPress;
    input.oninput = onInput;
    input.focus();
    checkValue = task.result;
    current = 0;
    nextStage = stage4;
    nextStageTimeout = 0;
  }

  /**
   * Этап 4. Отрисовка решенного уравнения.
   */
  function stage4() {
    currentView.drawTask({
      solved: true
    });
    nextStage = undefined;
  }
}