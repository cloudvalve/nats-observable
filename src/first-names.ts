import * as operators from "rxjs/operators";

import { createConsumer } from "./lib/createConsumer";

const app = async () => {
  const { fromChannel } = await createConsumer({
    broker: "test-cluster",
    name: "user-v2-first-names-starting-with-a0"
  });

  fromChannel("user-v2-first-names-starting-with-a")
    .pipe(operators.map(message => message.getData()))
    .forEach(console.log);
};

app();
