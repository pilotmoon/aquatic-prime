"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const index_1 = require("../index");
(0, ava_1.default)("hello", (t) => {
  t.is((0, index_1.hello)(), "Hello World!");
});
