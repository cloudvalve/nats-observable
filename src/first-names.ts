import * as operators from "rxjs/operators";

import { createConsumer } from "./lib/createConsumer";

const app = async () => {
  const { fromChannel } = await createConsumer({
    broker: "test-cluster",
    name: "user-v1-first-names-consumer-01"
  });

  fromChannel("user-v1-first-names-starting-with-a")
    .pipe(operators.map(message => message.getData()))
    .subscribe(console.log);
};

app();
