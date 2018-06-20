"use strict";
/* exported Exercise */

function Task() {
  this.a = 0;
  this.b = 0;
  this.result = 0;
  /**
   * Функция генерирует числа a и b , причем a ∈ [6, 9], a+b ∈ [11, 14].
   */
  this.generate = function () {
  this.a = Math.floor(Math.random() * (6 - 4 + 1)) + 4;
  this.result = Math.floor(Math.random() * (14 - 11 + 1)) + 11;
  this.b = this.result - this.a;
};

this.generate();
}

