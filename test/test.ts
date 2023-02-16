import test from "ava";
import { hello } from "../index";

test("hello", (t) => {
  t.is(hello(), "Hello World!");
});
