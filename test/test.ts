import test from "ava";
import { sign } from "../src/aquaticPrime";
import { generateKeys } from "../src/generateKeys";
import { base64ToBigint } from "bigint-conversion";

// example keys
const examplePublicKey =
  "6dv2pPa0QyghF8bV6SVfZzXcRdvLn6PKvQ8IJom0olUEojQOLy9UG/LOeYdJHsVB6LVJa7avI18YtsMfN8potDBDHkFhHpPc++QOt9PHJudLnWi5hncGpeDL1E4LiGOqw9L9vzzVexDD6QA56Wb3icyMvLHOu9Lrlf9fBeSPN6M=";
const examplePrivateKey =
  "m+f5w08i13AWD9nj8MOU73k9g+fdFRfcfgoFbwZ4bDitwXgJdMo4EqHe+6+GFIOBRc4w8nnKF5S7JIIUz9xFzC760ahNC4tELXFiNIbsNt9gNqStjNMZdD57zw7P6o0JVbEwXkL+MPBC1nqTF/EP880u37HQA4lu93kXQhmTSKs=";

test("sign", (t) => {
  const payload = {
    "name": "fooinator",
    "date": "2020-01-01",
    "version": "1.0.0",
    "description": "foo",
  };
  const expect =
    "vU67LJsEd8yDuxL+9Y9xfJYCl4IFLoO4pijK8n7J+UY7cxIhv3y9G3UdZ4nl9Xi7hfk2cbtv53xxQBRclZKoEZRrQPo+jz9WJIzzFaBzvX9PobSvtdyShXqTUOloEextvDwGB9KjU+OUv5jqyPc/auiZY9fcsgvFgJWEZXBfT+8=";
  t.is(
    sign(
      payload,
      base64ToBigint(examplePrivateKey),
      base64ToBigint(examplePublicKey),
    ),
    base64ToBigint(expect),
  );
});
