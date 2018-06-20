"use strict";

/* exported View */

/**
 * Представление (View)
 * @constructor
 * @param {Object} task - объект задачи
 */
function View(task) {

  var currentTask = task;
  var canvas, ctx;
  var topTask;
  var img;
  var arrows;

  /**
   * Инициализация, настройка высоты/ширины, создание подчиненных объектов,
   * отрисовка линейки
   */
  this.init = function () {
    canvas = document.getElementById(`canvas`);
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;

    ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";

    topTask = new topTask(currentTask);

    img = new Img();
    img.draw();

    arrows = [];
    arrows[0] = new Arrow(0, currentTask.a);
    arrows[1] = new Arrow(currentTask.a, currentTask.result);
  };

  /**
   * Отрисовывается уравнение с подсветкой одного из операндов или с отображением результата в зависомости от опций
   * @param {Object} options - опции отрисовки верхнего уравнения
   * @param {Number} options.mark - номер операнда, который нужно "подсветить" при отрисовке.
   * @param {Boolean} options.solved - Если "истина" - отрисовывается значение результата. Иначе "?"
   */
    this.drawTask = function (options) {
      if (options === undefined)
        options = {};

      topTask.clear();
      if (options.mark === 1 || options.mark === 2)
        topTask.drawOpMark(options.mark);

      topTask.drawTask();
      (options.solved === true) ? topTask.drawResult() : topTask.drawQuestionSign();
    };

  /**
   * Отрисовывает стрелку на поле
   * @param {Number} num - номер стрелки, которую нужно нарисовать
   */
  this.drawArrow = function (num) {
    arrows[num - 1].draw();
    arrows[num - 1].drawValue();
  };

  /**
   * Добавляет на поле инпут для ввода очередного операнда
   * @param {Number} num - номер стрелки, для которой нужно показать инпут
   * @returns {HTMLElement} - инпут типа "text"
   */
  this.drawInput = function (num) {
    return arrows[num - 1].drawInput();
  };

  /**
   * Добавляет на поле инпут для ввода результата
   * @returns {HTMLElement} - инпут типа "text"
   */
  this.drawResultInput = function () {
    return topTask.drawInput();
  };

  /**
   * Верхняя строка с уравнением
   * @constructor
   * @param {Object} task - объект упражнения
   */
  function topTask(task) {
    var taskText = task.a + " + " + task.b + " = ";
    var resultText = task.result.toString();
    var params = {};

    init(params);

    /**
     * Параметры отображения строки уравнения
     * @typedef {Object} topTaskParams
     * @property {Number} fontSize - размер шрифта (px)
     * @property {String} fontFamily - CSS имя шрифта
     * @property {Number} width - полная ширина
     * @property {Number} left - левая граница
     * @property {Number} top - верхнаяя граница
     * @property {Array.<Number>} opLeft - левые границы операндов
     * @property {Array.<Number>} opWidth - ширины операндов
     * @property {Number} resultLeft - левая граница результата
     * @property {String} textColor - CSS цвет текста уравнения
     * @property {String} markColor - CSS цвет отетки операнда
     * @property {Number} markPadding - отступ от операнда до границ отметки
     */

    /**
     * Заполняет параметры отображения строки уравнения
     * @param {topTaskParams} _p - параметры отображения уравнения
     */
    function init(_p) {
      _p.fontSize = 48;
      _p.fontFamily = "sans-serif";
      ctx.font = _p.fontSize + "px " + _p.fontFamily;
      _p.width = ctx.measureText(taskText + resultText).width ^ 0;
      _p.left = (canvas.width - _p.width) / 2 ^ 0;
      _p.top = 30;
      _p.opLeft = [
        _p.left,
        _p.left + ctx.measureText(task.a + " + ").width ^ 0
      ];
      _p.opWidth = [
        ctx.measureText(task.a).width ^ 0,
        ctx.measureText(task.b).width ^ 0
      ];
      _p.resultLeft = _p.left + ctx.measureText(taskText).width ^ 0;
      _p.textColor = "black";
      _p.markColor = "orange";
      _p.markPadding = 2;
    }

    /**
     * Очищает область на которой нарисовано уравнение с учетом отступов до границ отметок операндов
     */
    this.clear = function () {
      ctx.clearRect(params.left - params.markPadding, params.top, params.width + 2 * params.markPadding, params.fontSize);
    };

    /**
     * Отрисовывает левую часть уравнения, до символа "=" включительно
     */
    this.drawTask = function () {
      ctx.textAlign = "left";
      ctx.fillStyle = params.textColor;
      ctx.font = params.fontSize + "px " + params.fontFamily;
      ctx.fillText(taskText, params.left, params.top);
    };

    /**
     * Отрисовывает отметку под операндом в случае ошибки ввода
     * @param {Number} num - номер операнда под которым нужно нарисовать отметку
     */
    this.drawOpMark = function (num) {
      ctx.fillStyle = params.markColor;
      ctx.fillRect(params.opLeft[num - 1] - params.markPadding, params.top, params.opWidth[num - 1] + 2 * params.markPadding, params.fontSize);
    };

    /**
     * Отрисовывает символ "?" пока уравнение не решено
     */
    this.drawQuestionSign = function () {
      ctx.textAlign = "left";
      ctx.fillStyle = params.textColor;
      ctx.font = params.fontSize + "px " + params.fontFamily;
      ctx.fillText("?", params.resultLeft, params.top);
    };

    /**
     * Отрисовывает результат решенного уравнения
     */
    this.drawResult = function () {
      ctx.textAlign = "left";
      ctx.fillStyle = params.textColor;
      ctx.font = params.fontSize + "px " + params.fontFamily;
      ctx.fillText(resultText, params.resultLeft, params.top);
    };

    /**
     * Отрисовывает инпут для ввода результата решения уравнения справа от строки уравнения
     * @returns {HTMLElement} - инпут типа "text"
     */
    this.drawInput = function () {
      var input = document.createElement("input");

      document.getElementById("task").appendChild(input);
      input.type = "text";
      input.maxLength = 2;
      input.style.position = "absolute";
      input.style.fontSize = params.fontSize + "px";
      input.style.fontFamily = params.fontFamily;
      input.style.textAlign = "left";
      input.style.left = (params.resultLeft - input.clientLeft) + "px";
      input.style.top = (params.top - input.clientTop - 1) + "px";
      input.style.width = "2em";

      return input;
    }
  }

  /**
   * Линейка
   * @constructor
   */
  function Img() {
    this.left = 0;
    this.top = 0;
    Object.defineProperty(this, "zeroPos", { // Отступ от левой границы спрайта до отметки "0"
      configurable: false,
      value: 35,
      writable: false
    });
    Object.defineProperty(this, "stepSize", { // Шаг между метками на линейке
      configurable: false,
      value: 39,
      writable: false
    });

    /**
     * Отрисовывает линейку по горизонтали по центру родительского канваса, по вертикали в 20px от нижней границы
     */
    this.draw = function () {
      var img = document.getElementById(`img`);
      this.left = (canvas.width - img.width) / 2 ^ 0;
      this.top = canvas.height - img.height - 20;
      ctx.drawImage(img, this.left, this.top);
    }

  }

  /**
   * Стрелки на линейки и поля воода для них
   * @constructor
   * @param {Number} start - начальная позиция на линейке
   * @param {Number} end - конечная позиция на линейке
   */
  function Arrow(start, end) {
    var params = {};

    init(params);

    /**
     * Параметры отображения стрелок
     * @typedef {Object} arrowParams
     * @property {Number} value - длина стрелки (разность между конечным и начальным значениями)
     * @property {Number} left - левая граница
     * @property {Number} right - правая граница
     * @property {Number} center - центр стрелки по горизонтали
     * @property {Number} control - расстояние до опорных точек кривой Безье. Определяет степень кривизны стрелки.
     * @property {Number} bottom - нижняя граница
     * @property {Number} top - верхняя граница
     * @property {Number} capW - длина окончания стрелки
     * @property {Number} capL - ширина окончания стрелки
     * @property {String} strokeStyle - CSS цвет линии стрелки
     * @property {Number} lineWidth - толщина стрелки
     * @property {Number} fontSize - размер шрифта (px)
     * @property {String} fontFamily - CSS имя шрифта
     * @property {Number} valueGap - расстояние от верха стрелки до поля ввода или надписи значения
     */

    /**
     * Заполняет параметры отображения стрелки
     * @param {arrowParams} _p - параметры отображения стрелки
     */
    function init(_p) {
      _p.value = end - start;
      _p.left = img.left + img.zeroPos + start * img.stepSize;
      _p.right = img.left + img.zeroPos + end * img.stepSize;
      _p.center = (_p.left + _p.right) / 2 ^ 0;
      _p.control = (_p.right - _p.left) / 4 ^ 0;
      _p.bottom = img.top + 20;
      // Приблизительный верх стрелки. Для опорных точек в 1/4 длины стрелки корректирующий коэффициент '(end - start)*22/9'
      // Для других опорных точек необходимо подбирать!
      _p.top = _p.bottom - _p.control + (end - start) * 22 / 9 ^ 0;
      _p.capW = 5;
      _p.capL = 3 * _p.capW;
      _p.strokeStyle = '#b55b84';
      _p.lineWidth = 2;
      _p.fontSize = 36;
      _p.fontFamily = "sans-serif";
      _p.valueGap = 20;
    }

    /**
     * Отрисовывает стрелку на линейке
     */
    this.draw = function () {
      ctx.beginPath();
      ctx.strokeStyle = params.strokeStyle;
      ctx.lineWidth = params.lineWidth;
      ctx.moveTo(params.left, params.bottom);
      ctx.bezierCurveTo(params.left + params.control,
        params.bottom - params.control,
        params.right - params.control,
        params.bottom - params.control, params.right, params.bottom);
      ctx.moveTo(params.right - params.capW, params.bottom - params.capL);
      ctx.lineTo(params.right, params.bottom);
      ctx.lineTo(params.right - params.capL, params.bottom - params.capW);
      ctx.stroke();
    };

    /**
     * Отрисовывает значение над стрелкой
     */
    this.drawValue = function () {
      ctx.textAlign = "center";
      ctx.font = params.fontSize + "px " + params.fontFamily;
      ctx.fillText(params.value, params.center, params.top - params.valueGap - params.fontSize);

    };

    /**
     * Отрисовывает инпут для ввода значения операнда
     * @returns {HTMLElement} - инпут типа "text"
     */
    this.drawInput = function () {
      var input = document.createElement("input");

      document.getElementById("task").appendChild(input);
      input.type = "text";
      input.maxLength = 1;
      input.style.position = "absolute";
      input.style.fontSize = params.fontSize + "px";
      input.style.fontFamily = params.fontFamily;
      input.style.textAlign = "center";
      input.style.left = (params.center - input.clientLeft - params.fontSize / 2 ^ 0) + "px";
      input.style.top = (params.top - params.valueGap - input.clientTop - 1 - params.fontSize) + "px";
      input.style.width = "1em";

      return input;
    }
  }
}