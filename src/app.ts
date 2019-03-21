import { createConsumer } from "./lib/createConsumer";

import * as operators from "rxjs/operators";
import { createProducer } from "./lib/createProducer";

const app = async () => {
  const { fromChannel } = await createConsumer({
    broker: "test-cluster",
    name: "uppercase-first-name-01"
  });

  const { toChannel } = createProducer({
    broker: "test-cluster"
  });

  fromChannel("user-v1")
    .pipe(
      operators.map(message => message.getData()),
      operators.map(event => JSON.parse(event)),
      operators.map(event => event.payload),
      operators.map(payload => payload.firstName),
      operators.filter(firstName => firstName.charAt(0).toUpperCase() === "A"),
      operators.concatMap(toChannel("user-v1-first-names-starting-with-a"))
    )
    .subscribe(console.log);
};

app().catch(err => {
  process.exitCode = 1;

  console.error(err.message);
});
